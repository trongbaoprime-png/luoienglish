import { AudioMixer } from "./AudioMixer";
import { getSoundMetadata, SoundMetadata } from "../assets/soundRegistry";

export type PlaybackPolicy = "THROTTLE" | "REPLACE" | "SINGLE" | "LIMITED_OVERLAP" | "EXCLUSIVE";

export interface PlaybackOptions {
  volumeMultiplier?: number;
  onEnded?: () => void;
  loop?: boolean;
}

export class SoundPlaybackService {
  private static lastPlayedTimestamps: Record<string, number> = {};
  private static activeAudioElements: Map<string, HTMLAudioElement> = new Map();
  private static activeOverlapCounts: Map<string, number> = new Map();
  private static currentVoiceSoundId: string | null = null;
  private static currentAmbienceSoundId: string | null = null;

  /**
   * Determine playback policy based on sound category
   */
  public static getPlaybackPolicy(sound: SoundMetadata): PlaybackPolicy {
    if (sound.channel === "VOICE") return "REPLACE";
    if (sound.channel === "AMBIENCE" || sound.channel === "MUSIC") return "SINGLE";
    if (sound.id === "reward.levelUp" || sound.id === "reward.achievement") return "EXCLUSIVE";
    if (sound.category === "UI") return "THROTTLE";
    return "LIMITED_OVERLAP";
  }

  /**
   * Plays a semantic sound event applying category policies, mixer channel gains, and automatic ducking
   */
  public static playSound(
    soundId: string,
    options: PlaybackOptions = {}
  ): { played: boolean; reason?: string } {
    const meta = getSoundMetadata(soundId);
    if (!meta) {
      return { played: false, reason: "UNKNOWN_SOUND" };
    }

    const now = Date.now();
    const policy = this.getPlaybackPolicy(meta);

    // 1. Policy check: THROTTLE (60ms)
    if (policy === "THROTTLE") {
      const last = this.lastPlayedTimestamps[soundId] || 0;
      if (now - last < 60) {
        return { played: false, reason: "THROTTLED" };
      }
    }

    // 2. Policy check: LIMITED_OVERLAP (max 3 concurrent)
    if (policy === "LIMITED_OVERLAP") {
      const count = this.activeOverlapCounts.get(soundId) || 0;
      if (count >= 3) {
        return { played: false, reason: "OVERLAP_LIMIT_REACHED" };
      }
    }

    // 3. Policy check: REPLACE (stop previous active sound in same category)
    if (policy === "REPLACE" && meta.channel === "VOICE") {
      if (this.currentVoiceSoundId && this.activeAudioElements.has(this.currentVoiceSoundId)) {
        const prev = this.activeAudioElements.get(this.currentVoiceSoundId);
        prev?.pause();
        this.activeAudioElements.delete(this.currentVoiceSoundId);
      }
    }

    // 4. Policy check: SINGLE (ambience tracks)
    if (policy === "SINGLE" && meta.channel === "AMBIENCE") {
      if (this.currentAmbienceSoundId && this.currentAmbienceSoundId !== soundId) {
        const prev = this.activeAudioElements.get(this.currentAmbienceSoundId);
        prev?.pause();
        this.activeAudioElements.delete(this.currentAmbienceSoundId);
      }
    }

    // 5. Volume & Ducking calculation
    const channelVol = AudioMixer.getEffectiveVolume(meta.channel);
    const finalVolume = channelVol * (options.volumeMultiplier ?? 1.0);

    if (finalVolume <= 0) {
      return { played: false, reason: "MUTED_OR_ZERO_VOLUME" };
    }

    // Apply automatic ducking when Voice starts
    if (meta.channel === "VOICE") {
      AudioMixer.duckAmbience(0.2);
      this.currentVoiceSoundId = soundId;
    }

    // Browser HTML5 Audio execution
    if (typeof window !== "undefined" && typeof Audio !== "undefined") {
      try {
        const audio = new Audio(meta.url);
        audio.volume = Math.max(0, Math.min(1, finalVolume));
        audio.loop = Boolean(options.loop);

        const currentCount = this.activeOverlapCounts.get(soundId) || 0;
        this.activeOverlapCounts.set(soundId, currentCount + 1);
        this.activeAudioElements.set(soundId, audio);

        const cleanup = () => {
          const c = this.activeOverlapCounts.get(soundId) || 1;
          this.activeOverlapCounts.set(soundId, Math.max(0, c - 1));
          this.activeAudioElements.delete(soundId);

          if (meta.channel === "VOICE") {
            AudioMixer.unduckAmbience();
            this.currentVoiceSoundId = null;
          }

          if (options.onEnded) options.onEnded();
        };

        audio.addEventListener("ended", cleanup, { once: true });
        audio.addEventListener("error", cleanup, { once: true });

        audio.play().catch(() => {
          cleanup();
        });
      } catch {
        // Fallback for restricted audio autoplay policy
        if (meta.channel === "VOICE") {
          setTimeout(() => AudioMixer.unduckAmbience(), meta.durationMs || 1000);
        }
      }
    } else {
      // Node.js simulation
      if (meta.channel === "VOICE") {
        setTimeout(() => AudioMixer.unduckAmbience(), meta.durationMs || 500);
      }
    }

    this.lastPlayedTimestamps[soundId] = now;
    return { played: true };
  }

  /**
   * Stop all active audio elements and reset ducking
   */
  public static stopAll(): void {
    if (typeof window !== "undefined") {
      this.activeAudioElements.forEach((audio) => {
        try {
          audio.pause();
        } catch {}
      });
    }
    this.activeAudioElements.clear();
    this.activeOverlapCounts.clear();
    this.currentVoiceSoundId = null;
    this.currentAmbienceSoundId = null;
    AudioMixer.unduckAmbience();
  }
}
