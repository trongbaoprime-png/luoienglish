import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { AudioMixer } from "./AudioMixer";

describe("AudioMixer & Multi-Channel Sound Engine (LE-011)", () => {
  beforeEach(() => {
    AudioMixer.updateSettings({
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
    });
    AudioMixer.unduckAmbience();
  });

  it("Test 1: Normal channel gains match settings", () => {
    const voiceVol = AudioMixer.getEffectiveVolume("VOICE");
    const sfxVol = AudioMixer.getEffectiveVolume("SFX");
    const ambVol = AudioMixer.getEffectiveVolume("AMBIENCE");

    assert.strictEqual(voiceVol, 1.0);
    assert.strictEqual(sfxVol, 0.8);
    assert.strictEqual(ambVol, 0.25);
  });

  it("Test 2: Automatic Ambience Ducking reduces background to 20%", () => {
    AudioMixer.duckAmbience(0.2);
    assert.strictEqual(AudioMixer.getIsDucked(), true);

    const duckedAmb = AudioMixer.getEffectiveVolume("AMBIENCE");
    // 0.25 * 0.2 = 0.05
    assert.strictEqual(Math.round(duckedAmb * 100) / 100, 0.05);

    // Voice channel remains 100% crystal clear
    assert.strictEqual(AudioMixer.getEffectiveVolume("VOICE"), 1.0);

    // Unduck restores original gain
    AudioMixer.unduckAmbience();
    assert.strictEqual(AudioMixer.getIsDucked(), false);
    assert.strictEqual(AudioMixer.getEffectiveVolume("AMBIENCE"), 0.25);
  });

  it("Test 3: Reduced Stimulation mode completely silences background ambience and music", () => {
    AudioMixer.updateSettings({ reducedStimulation: true });

    assert.strictEqual(AudioMixer.getEffectiveVolume("AMBIENCE"), 0);
    assert.strictEqual(AudioMixer.getEffectiveVolume("MUSIC"), 0);
    // Voice and SFX remain active for learning
    assert.strictEqual(AudioMixer.getEffectiveVolume("VOICE"), 1.0);
    assert.strictEqual(AudioMixer.getEffectiveVolume("SFX"), 0.8);
  });

  it("Test 4: Volume updates are securely clamped between 0 and 1", () => {
    AudioMixer.updateSettings({
      masterVolume: 2.5, // should clamp to 1.0
      voiceVolume: -0.5, // should clamp to 0.0
    });

    const settings = AudioMixer.getSettings();
    assert.strictEqual(settings.masterVolume, 1.0);
    assert.strictEqual(settings.voiceVolume, 0.0);
  });
});
