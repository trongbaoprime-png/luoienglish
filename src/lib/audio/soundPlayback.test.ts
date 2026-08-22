import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { SoundPlaybackService } from "./SoundPlaybackService";
import { AudioMixer } from "./AudioMixer";
import { getSoundMetadata } from "../assets/soundRegistry";

describe("SoundPlaybackService & Concurrency Chaos Protection (LE-011B)", () => {
  beforeEach(() => {
    SoundPlaybackService.stopAll();
    AudioMixer.updateSettings({
      masterVolume: 1.0,
      voiceVolume: 1.0,
      sfxVolume: 0.8,
      ambienceVolume: 0.25,
      voiceEnabled: true,
      sfxEnabled: true,
      ambienceEnabled: true,
      reducedStimulation: false,
    });
  });

  it("Test 1: Assigns sound categories to appropriate playback policies", () => {
    const tapMeta = getSoundMetadata("ui.tap")!;
    assert.strictEqual(SoundPlaybackService.getPlaybackPolicy(tapMeta), "THROTTLE");

    const voiceMeta = getSoundMetadata("pet.greeting")!;
    assert.strictEqual(SoundPlaybackService.getPlaybackPolicy(voiceMeta), "REPLACE");

    const ambMeta = getSoundMetadata("ambience.cozy.treehouse")!;
    assert.strictEqual(SoundPlaybackService.getPlaybackPolicy(ambMeta), "SINGLE");

    const achMeta = getSoundMetadata("reward.achievement")!;
    assert.strictEqual(SoundPlaybackService.getPlaybackPolicy(achMeta), "EXCLUSIVE");
  });

  it("Test 2: Rapid UI taps are throttled to protect from audio chaos", () => {
    const first = SoundPlaybackService.playSound("ui.tap");
    assert.strictEqual(first.played, true);

    // Immediate second tap within 60ms
    const second = SoundPlaybackService.playSound("ui.tap");
    assert.strictEqual(second.played, false);
    assert.strictEqual(second.reason, "THROTTLED");
  });

  it("Test 3: Voice playback ducks ambience automatically", () => {
    assert.strictEqual(AudioMixer.getIsDucked(), false);

    SoundPlaybackService.playSound("pet.greeting");
    assert.strictEqual(AudioMixer.getIsDucked(), true);
    assert.strictEqual(AudioMixer.getEffectiveVolume("AMBIENCE") <= 0.06, true);

    SoundPlaybackService.stopAll();
    assert.strictEqual(AudioMixer.getIsDucked(), false);
  });

  it("Test 4: Unknown sound fails safely with zero exceptions", () => {
    const res = SoundPlaybackService.playSound("invalid.sound.id");
    assert.strictEqual(res.played, false);
    assert.strictEqual(res.reason, "UNKNOWN_SOUND");
  });

  it("Test 5: Muted SFX category respects mixer and does not play", () => {
    AudioMixer.updateSettings({ sfxEnabled: false });
    const res = SoundPlaybackService.playSound("reward.star");
    assert.strictEqual(res.played, false);
    assert.strictEqual(res.reason, "MUTED_OR_ZERO_VOLUME");
  });
});
