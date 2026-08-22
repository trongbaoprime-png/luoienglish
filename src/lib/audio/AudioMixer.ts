export type AudioChannel = "MASTER" | "VOICE" | "SFX" | "AMBIENCE" | "MUSIC";

export interface AudioMixerSettings {
  masterVolume: number;
  voiceVolume: number;
  sfxVolume: number;
  ambienceVolume: number;
  musicVolume: number;
  sfxEnabled: boolean;
  voiceEnabled: boolean;
  ambienceEnabled: boolean;
  musicEnabled: boolean;
  reducedStimulation: boolean;
}

export class AudioMixer {
  private static settings: AudioMixerSettings = {
    masterVolume: 1.0,
    voiceVolume: 1.0,
    sfxVolume: 0.8,
    ambienceVolume: 0.25,
    musicVolume: 0.3,
    sfxEnabled: true,
    voiceEnabled: true,
    ambienceEnabled: true,
    musicEnabled: true,
    reducedStimulation: false,
  };

  private static isDucked = false;
  private static duckMultiplier = 1.0;

  /**
   * Updates mixer settings with bounds clamping
   */
  public static updateSettings(newSettings: Partial<AudioMixerSettings>) {
    this.settings = {
      ...this.settings,
      ...newSettings,
      masterVolume: Math.max(0, Math.min(1, newSettings.masterVolume ?? this.settings.masterVolume)),
      voiceVolume: Math.max(0, Math.min(1, newSettings.voiceVolume ?? this.settings.voiceVolume)),
      sfxVolume: Math.max(0, Math.min(1, newSettings.sfxVolume ?? this.settings.sfxVolume)),
      ambienceVolume: Math.max(0, Math.min(1, newSettings.ambienceVolume ?? this.settings.ambienceVolume)),
      musicVolume: Math.max(0, Math.min(1, newSettings.musicVolume ?? this.settings.musicVolume)),
    };
  }

  public static getSettings(): AudioMixerSettings {
    return { ...this.settings };
  }

  /**
   * Automatically ducks background ambience & music when English voice audio starts playing
   */
  public static duckAmbience(duckRatio = 0.2): void {
    this.isDucked = true;
    this.duckMultiplier = Math.max(0, Math.min(1, duckRatio));
  }

  /**
   * Smoothly restores ambience & music volume after voice audio completes
   */
  public static unduckAmbience(): void {
    this.isDucked = false;
    this.duckMultiplier = 1.0;
  }

  /**
   * Computes effective volume gain for a given channel
   */
  public static getEffectiveVolume(channel: AudioChannel): number {
    const s = this.settings;
    if (s.reducedStimulation && (channel === "AMBIENCE" || channel === "MUSIC")) {
      return 0;
    }

    let channelGain = 1.0;
    switch (channel) {
      case "MASTER":
        return s.masterVolume;
      case "VOICE":
        channelGain = s.voiceEnabled ? s.voiceVolume : 0;
        break;
      case "SFX":
        channelGain = s.sfxEnabled ? s.sfxVolume : 0;
        break;
      case "AMBIENCE":
        channelGain = s.ambienceEnabled ? s.ambienceVolume * this.duckMultiplier : 0;
        break;
      case "MUSIC":
        channelGain = s.musicEnabled ? s.musicVolume * this.duckMultiplier : 0;
        break;
    }

    return s.masterVolume * channelGain;
  }

  public static getIsDucked(): boolean {
    return this.isDucked;
  }
}
