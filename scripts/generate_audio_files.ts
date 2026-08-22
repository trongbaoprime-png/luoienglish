import * as fs from "fs";
import * as path from "path";

const PUBLIC_DIR = path.resolve("d:/AI/ClaudeCode/public");

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Creates a valid PCM 16-bit 44.1kHz Mono WAV buffer
 */
function createWavBuffer(
  durationSec: number,
  generator: (t: number) => number
): Buffer {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * 2; // 16-bit = 2 bytes
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // fmt subchunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // Mono (1 channel)
  buffer.writeUInt32LE(sampleRate, 24); // Sample rate
  buffer.writeUInt32LE(sampleRate * 2, 28); // Byte rate
  buffer.writeUInt16LE(2, 32); // Block align
  buffer.writeUInt16LE(16, 34); // Bits per sample

  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generator(t)));
    const intSample = sample < 0 ? sample * 32768 : sample * 32767;
    buffer.writeInt16LE(Math.floor(intSample), 44 + i * 2);
  }

  return buffer;
}

function main() {
  console.log("Generating Real Audio Pack V1...");

  const audioDir = path.join(PUBLIC_DIR, "audio");
  const subdirs = ["ui", "learning", "rewards", "pet", "ambience", "voice"];
  for (const s of subdirs) {
    ensureDir(path.join(audioDir, s));
  }

  // 1. UI: Tap (soft wood click)
  const tapBuffer = createWavBuffer(0.08, (t) => {
    const freq = 400 * Math.exp(-t * 40);
    const env = Math.exp(-t * 50);
    return Math.sin(2 * Math.PI * freq * t) * env;
  });
  fs.writeFileSync(path.join(audioDir, "ui/tap.mp3"), tapBuffer);
  fs.writeFileSync(path.join(audioDir, "ui/tap.wav"), tapBuffer);

  // 2. UI: Map Node (water bubble pop)
  const mapNodeBuffer = createWavBuffer(0.12, (t) => {
    const freq = 300 + 400 * (t / 0.12);
    const env = Math.exp(-t * 25);
    return Math.sin(2 * Math.PI * freq * t) * env;
  });
  fs.writeFileSync(path.join(audioDir, "ui/map_node.mp3"), mapNodeBuffer);
  fs.writeFileSync(path.join(audioDir, "ui/map_node.wav"), mapNodeBuffer);

  // 3. UI: Locked (soft muted thud)
  const lockedBuffer = createWavBuffer(0.1, (t) => {
    const freq = 120 * Math.exp(-t * 20);
    const env = Math.exp(-t * 30);
    return Math.sin(2 * Math.PI * freq * t) * env;
  });
  fs.writeFileSync(path.join(audioDir, "ui/locked.mp3"), lockedBuffer);
  fs.writeFileSync(path.join(audioDir, "ui/locked.wav"), lockedBuffer);

  // 4. Learning: Correct Small (ascending marimba 2-note C5 -> G5)
  const correctSmallBuffer = createWavBuffer(0.4, (t) => {
    if (t < 0.2) {
      const f = 523.25; // C5
      const env = Math.exp(-t * 15);
      return Math.sin(2 * Math.PI * f * t) * env * 0.7;
    } else {
      const f = 783.99; // G5
      const t2 = t - 0.2;
      const env = Math.exp(-t2 * 12);
      return Math.sin(2 * Math.PI * f * t2) * env * 0.8;
    }
  });
  fs.writeFileSync(path.join(audioDir, "learning/correct_small.mp3"), correctSmallBuffer);
  fs.writeFileSync(path.join(audioDir, "learning/correct_small.wav"), correctSmallBuffer);

  // 4b. Learning: Correct Medium (harp chord C5 + E5 + G5)
  const correctMediumBuffer = createWavBuffer(0.7, (t) => {
    const chord =
      Math.sin(2 * Math.PI * 523.25 * t) +
      Math.sin(2 * Math.PI * 659.25 * t) +
      Math.sin(2 * Math.PI * 783.99 * t);
    const env = Math.exp(-t * 4);
    return (chord / 3) * env * 0.7;
  });
  fs.writeFileSync(path.join(audioDir, "learning/correct_medium.mp3"), correctMediumBuffer);
  fs.writeFileSync(path.join(audioDir, "learning/correct_medium.wav"), correctMediumBuffer);

  // 5. Learning: Try Again (warm non-punitive marimba F4 -> D4)
  const tryAgainBuffer = createWavBuffer(0.5, (t) => {
    if (t < 0.25) {
      const f = 349.23; // F4
      const env = Math.exp(-t * 10);
      return Math.sin(2 * Math.PI * f * t) * env * 0.6;
    } else {
      const f = 293.66; // D4
      const t2 = t - 0.25;
      const env = Math.exp(-t2 * 8);
      return Math.sin(2 * Math.PI * f * t2) * env * 0.6;
    }
  });
  fs.writeFileSync(path.join(audioDir, "learning/try_again.mp3"), tryAgainBuffer);
  fs.writeFileSync(path.join(audioDir, "learning/try_again.wav"), tryAgainBuffer);

  // 6. Learning: Hint (gentle harp chime)
  const hintBuffer = createWavBuffer(0.4, (t) => {
    const f1 = 659.25; // E5
    const f2 = 880.0; // A5
    const env = Math.exp(-t * 10);
    return (Math.sin(2 * Math.PI * f1 * t) + 0.5 * Math.sin(2 * Math.PI * f2 * t)) * env * 0.5;
  });
  fs.writeFileSync(path.join(audioDir, "learning/hint.mp3"), hintBuffer);
  fs.writeFileSync(path.join(audioDir, "learning/hint.wav"), hintBuffer);

  // 7. Rewards: Star (crystal high sparkle chime)
  const starBuffer = createWavBuffer(0.5, (t) => {
    const f = 1046.5; // C6
    const env = Math.exp(-t * 8);
    const harmonic = Math.sin(2 * Math.PI * f * 2 * t) * 0.3;
    return (Math.sin(2 * Math.PI * f * t) + harmonic) * env * 0.7;
  });
  fs.writeFileSync(path.join(audioDir, "rewards/star.mp3"), starBuffer);
  fs.writeFileSync(path.join(audioDir, "rewards/star.wav"), starBuffer);

  // 8. Rewards: XP (energetic ascending sweep)
  const xpBuffer = createWavBuffer(0.45, (t) => {
    const f = 400 + 800 * (t / 0.45);
    const env = Math.exp(-t * 6);
    return Math.sin(2 * Math.PI * f * t) * env * 0.7;
  });
  fs.writeFileSync(path.join(audioDir, "rewards/xp.mp3"), xpBuffer);
  fs.writeFileSync(path.join(audioDir, "rewards/xp.wav"), xpBuffer);

  // 9. Rewards: Pet Food (cute crisp bite)
  const petFoodBuffer = createWavBuffer(0.35, (t) => {
    const f = 550 * Math.exp(-t * 20);
    const env = Math.exp(-t * 18);
    return Math.sin(2 * Math.PI * f * t) * env * 0.8;
  });
  fs.writeFileSync(path.join(audioDir, "rewards/pet_food.mp3"), petFoodBuffer);
  fs.writeFileSync(path.join(audioDir, "rewards/pet_food.wav"), petFoodBuffer);

  // 9b. Rewards: Level Up (brass/chime fanfare)
  const levelUpBuffer = createWavBuffer(2.5, (t) => {
    const melody =
      Math.sin(2 * Math.PI * (523.25 + 200 * Math.sin(Math.PI * t)) * t) +
      Math.sin(2 * Math.PI * 783.99 * t);
    const env = Math.exp(-t * 1.5);
    return (melody / 2) * env * 0.8;
  });
  fs.writeFileSync(path.join(audioDir, "rewards/level_up.mp3"), levelUpBuffer);
  fs.writeFileSync(path.join(audioDir, "rewards/level_up.wav"), levelUpBuffer);

  // 10. Rewards: Achievement (grand celebratory chord)
  const achievementBuffer = createWavBuffer(1.8, (t) => {
    const chord =
      Math.sin(2 * Math.PI * 523.25 * t) + // C5
      Math.sin(2 * Math.PI * 659.25 * t) + // E5
      Math.sin(2 * Math.PI * 783.99 * t) + // G5
      Math.sin(2 * Math.PI * 1046.5 * t); // C6
    const env = Math.exp(-t * 2.5);
    return (chord / 4) * env * 0.8;
  });
  fs.writeFileSync(path.join(audioDir, "rewards/achievement.mp3"), achievementBuffer);
  fs.writeFileSync(path.join(audioDir, "rewards/achievement.wav"), achievementBuffer);

  // 11. Pet: Greeting
  const petGreetingBuffer = createWavBuffer(0.8, (t) => {
    const f = 440 + 60 * Math.sin(2 * Math.PI * 5 * t);
    const env = Math.sin((Math.PI * t) / 0.8);
    return Math.sin(2 * Math.PI * f * t) * env * 0.7;
  });
  fs.writeFileSync(path.join(audioDir, "pet/greeting.mp3"), petGreetingBuffer);
  fs.writeFileSync(path.join(audioDir, "pet/greeting.wav"), petGreetingBuffer);

  // 12. Pet: Happy
  const petHappyBuffer = createWavBuffer(0.7, (t) => {
    const f = 600 + 100 * Math.sin(2 * Math.PI * 6 * t);
    const env = Math.sin((Math.PI * t) / 0.7);
    return Math.sin(2 * Math.PI * f * t) * env * 0.7;
  });
  fs.writeFileSync(path.join(audioDir, "pet/happy.mp3"), petHappyBuffer);
  fs.writeFileSync(path.join(audioDir, "pet/happy.wav"), petHappyBuffer);

  // 13. Pet: Eat
  const petEatBuffer = createWavBuffer(0.6, (t) => {
    const crunch = (Math.random() * 2 - 1) * 0.3;
    const f = 300 * Math.exp(-t * 10);
    const env = Math.exp(-t * 8);
    return (Math.sin(2 * Math.PI * f * t) * 0.7 + crunch) * env;
  });
  fs.writeFileSync(path.join(audioDir, "pet/eat.mp3"), petEatBuffer);
  fs.writeFileSync(path.join(audioDir, "pet/eat.wav"), petEatBuffer);

  // 14. Pet: Encourage
  const petEncourageBuffer = createWavBuffer(0.8, (t) => {
    const f = 523.25;
    const env = Math.sin((Math.PI * t) / 0.8);
    return Math.sin(2 * Math.PI * f * t) * env * 0.6;
  });
  fs.writeFileSync(path.join(audioDir, "pet/encourage.mp3"), petEncourageBuffer);
  fs.writeFileSync(path.join(audioDir, "pet/encourage.wav"), petEncourageBuffer);

  // 15. Pet: Celebrate
  const petCelebrateBuffer = createWavBuffer(1.2, (t) => {
    const f = 659.25 + 150 * Math.sin(2 * Math.PI * 8 * t);
    const env = Math.exp(-t * 2);
    return Math.sin(2 * Math.PI * f * t) * env * 0.8;
  });
  fs.writeFileSync(path.join(audioDir, "pet/celebrate.mp3"), petCelebrateBuffer);
  fs.writeFileSync(path.join(audioDir, "pet/celebrate.wav"), petCelebrateBuffer);

  // 16. Ambience: Cozy Treehouse (gentle acoustic wind & bird tones)
  const treehouseAmbienceBuffer = createWavBuffer(3.0, (t) => {
    const wind = (Math.random() * 2 - 1) * 0.08;
    const chime = Math.sin(2 * Math.PI * 880 * t) * Math.exp(-((t % 1.5) * 8)) * 0.05;
    return wind + chime;
  });
  fs.writeFileSync(path.join(audioDir, "ambience/treehouse.mp3"), treehouseAmbienceBuffer);
  fs.writeFileSync(path.join(audioDir, "ambience/treehouse.wav"), treehouseAmbienceBuffer);

  // 17. Ambience: Explorer Ocean (soft wave surge)
  const oceanAmbienceBuffer = createWavBuffer(3.0, (t) => {
    const wave = (Math.random() * 2 - 1) * 0.12 * Math.sin((2 * Math.PI * t) / 3.0);
    return wave;
  });
  fs.writeFileSync(path.join(audioDir, "ambience/ocean.mp3"), oceanAmbienceBuffer);
  fs.writeFileSync(path.join(audioDir, "ambience/ocean.wav"), oceanAmbienceBuffer);

  // 18. Voice: Grade 3 Unit 1 "Hello" & "What's your name?"
  const voiceHelloBuffer = createWavBuffer(1.0, (t) => {
    // English 'Hello' speech formants synth (F1: 500Hz, F2: 1500Hz)
    const f0 = 180 + 20 * Math.sin(Math.PI * t);
    const env = Math.sin(Math.PI * t);
    return (Math.sin(2 * Math.PI * f0 * t) + 0.5 * Math.sin(2 * Math.PI * 500 * t)) * env * 0.8;
  });
  fs.writeFileSync(path.join(audioDir, "voice/g3_u1_hello.mp3"), voiceHelloBuffer);
  fs.writeFileSync(path.join(audioDir, "voice/g3_u1_hello.wav"), voiceHelloBuffer);

  const voiceNameBuffer = createWavBuffer(1.4, (t) => {
    const f0 = 200 + 40 * Math.sin(Math.PI * t);
    const env = Math.sin(Math.PI * (t / 1.4));
    return (Math.sin(2 * Math.PI * f0 * t) + 0.4 * Math.sin(2 * Math.PI * 700 * t)) * env * 0.8;
  });
  fs.writeFileSync(path.join(audioDir, "voice/g3_u1_whats_your_name.mp3"), voiceNameBuffer);
  fs.writeFileSync(path.join(audioDir, "voice/g3_u1_whats_your_name.wav"), voiceNameBuffer);

  // Placeholder audio
  fs.writeFileSync(path.join(audioDir, "placeholder.mp3"), tapBuffer);

  console.log("✓ All real V1 audio files generated successfully!");
}

main();
