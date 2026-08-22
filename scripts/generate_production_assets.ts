import * as fs from "fs";
import * as path from "path";

const PUBLIC_DIR = path.resolve("d:/AI/ClaudeCode/public");

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

type Theme = "cozy" | "explorer";
type Pose =
  | "idle"
  | "hello"
  | "happy"
  | "thinking"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "encourage"
  | "clap"
  | "eat"
  | "sleep"
  | "sleeping"
  | "celebrate"
  | "celebrating";

function generateSlothSvg(theme: Theme, pose: Pose): string {
  const isCozy = theme === "cozy";

  let accessorySvg = "";
  if (isCozy) {
    if (pose === "sleep" || pose === "sleeping") {
      accessorySvg = `
        <path d="M 32 30 C 35 12, 70 8, 85 24 C 95 34, 98 52, 92 60" fill="#E63946" />
        <path d="M 28 32 C 40 26, 65 24, 76 34" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none" />
        <circle cx="94" cy="62" r="7" fill="#FFFFFF" />
      `;
    } else if (pose === "celebrate") {
      accessorySvg = `
        <polygon points="50,6 32,32 68,32" fill="#F4A261" stroke="#E76F51" stroke-width="2" />
        <circle cx="50" cy="5" r="5" fill="#E63946" />
        <circle cx="40" cy="24" r="3" fill="#2A9D8F" />
        <circle cx="60" cy="24" r="3" fill="#E76F51" />
      `;
    } else {
      accessorySvg = `
        <path d="M 32 32 C 34 16, 66 16, 68 32 Z" fill="#E63946" />
        <rect x="30" y="28" width="40" height="7" rx="3.5" fill="#F1FAEE" />
        <circle cx="50" cy="14" r="6" fill="#FFFFFF" />
      `;
    }
  } else {
    if (pose === "celebrate") {
      accessorySvg = `
        <ellipse cx="50" cy="30" rx="28" ry="8" fill="#D4A373" stroke="#99582A" stroke-width="2" />
        <path d="M 30 30 C 30 15, 70 15, 70 30 Z" fill="#E9C46A" />
        <rect x="30" y="27" width="40" height="5" fill="#99582A" />
        <circle cx="50" cy="29" r="3.5" fill="#E76F51" />
      `;
    } else {
      accessorySvg = `
        <ellipse cx="50" cy="30" rx="28" ry="8" fill="#D4A373" stroke="#99582A" stroke-width="2" />
        <path d="M 32 30 C 32 16, 68 16, 68 30 Z" fill="#E9C46A" />
        <rect x="32" y="27" width="36" height="5" fill="#99582A" />
        <circle cx="50" cy="29" r="3" fill="#2A9D8F" />
      `;
    }
  }

  let faceFeaturesSvg = "";
  if (pose === "sleep" || pose === "sleeping") {
    faceFeaturesSvg = `
      <path d="M 36 50 Q 42 56 46 50" stroke="#3D2619" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M 54 50 Q 58 56 64 50" stroke="#3D2619" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M 47 58 Q 50 61 53 58" stroke="#3D2619" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <text x="75" y="35" font-size="14" font-weight="bold" fill="#457B9D" font-family="sans-serif">z</text>
      <text x="83" y="24" font-size="18" font-weight="bold" fill="#1D3557" font-family="sans-serif">Z</text>
    `;
  } else if (pose === "happy" || pose === "celebrate" || pose === "clap") {
    faceFeaturesSvg = `
      <path d="M 34 50 Q 40 44 46 50" stroke="#3D2619" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M 54 50 Q 60 44 66 50" stroke="#3D2619" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M 42 58 Q 50 68 58 58 Z" fill="#E63946" stroke="#3D2619" stroke-width="1.5" />
    `;
  } else if (pose === "thinking") {
    faceFeaturesSvg = `
      <ellipse cx="40" cy="48" rx="5.5" ry="6.5" fill="#3D2619" />
      <circle cx="42" cy="46" r="2" fill="#FFFFFF" />
      <ellipse cx="60" cy="48" rx="5.5" ry="6.5" fill="#3D2619" />
      <circle cx="62" cy="46" r="2" fill="#FFFFFF" />
      <path d="M 45 60 Q 50 63 55 59" stroke="#3D2619" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <circle cx="78" cy="38" r="4" fill="#F4A261" />
      <circle cx="86" cy="28" r="7" fill="#E9C46A" />
      <text x="83" y="32" font-size="10" font-weight="bold" fill="#3D2619" font-family="sans-serif">?</text>
    `;
  } else if (pose === "speaking") {
    faceFeaturesSvg = `
      <ellipse cx="40" cy="50" rx="5.5" ry="6.5" fill="#3D2619" />
      <circle cx="42" cy="48" r="2.2" fill="#FFFFFF" />
      <circle cx="38" cy="52" r="1.2" fill="#FFFFFF" />
      <ellipse cx="60" cy="50" rx="5.5" ry="6.5" fill="#3D2619" />
      <circle cx="62" cy="48" r="2.2" fill="#FFFFFF" />
      <circle cx="58" cy="52" r="1.2" fill="#FFFFFF" />
      <ellipse cx="50" cy="60" rx="5" ry="6" fill="#E63946" stroke="#3D2619" stroke-width="1.5" />
      <path d="M 47 62 Q 50 65 53 62" fill="#FFB703" />
      <path d="M 68 56 Q 74 60 68 64" stroke="#F4A261" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M 73 52 Q 81 60 73 68" stroke="#E76F51" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `;
  } else if (pose === "listening") {
    faceFeaturesSvg = `
      <ellipse cx="38" cy="50" rx="5.5" ry="6.5" fill="#3D2619" />
      <circle cx="40" cy="48" r="2" fill="#FFFFFF" />
      <ellipse cx="58" cy="50" rx="5.5" ry="6.5" fill="#3D2619" />
      <circle cx="60" cy="48" r="2" fill="#FFFFFF" />
      <path d="M 45 58 Q 50 62 55 58" stroke="#3D2619" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <text x="75" y="44" font-size="16" fill="#2A9D8F" font-family="sans-serif">♪</text>
    `;
  } else {
    faceFeaturesSvg = `
      <ellipse cx="40" cy="50" rx="5.5" ry="6.5" fill="#3D2619" />
      <circle cx="42" cy="48" r="2.2" fill="#FFFFFF" />
      <circle cx="38" cy="52" r="1" fill="#FFFFFF" />
      <ellipse cx="60" cy="50" rx="5.5" ry="6.5" fill="#3D2619" />
      <circle cx="62" cy="48" r="2.2" fill="#FFFFFF" />
      <circle cx="58" cy="52" r="1" fill="#FFFFFF" />
      <path d="M 44 58 Q 50 64 56 58" stroke="#3D2619" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `;
  }

  let armsSvg = "";
  if (pose === "hello") {
    armsSvg = `
      <path d="M 70 65 Q 86 48 82 34" stroke="#A98467" stroke-width="12" stroke-linecap="round" fill="none" />
      <circle cx="80" cy="30" r="2.5" fill="#E6CCB2" />
      <circle cx="84" cy="32" r="2.5" fill="#E6CCB2" />
      <circle cx="87" cy="36" r="2.5" fill="#E6CCB2" />
      <path d="M 30 65 Q 22 75 28 85" stroke="#A98467" stroke-width="11" stroke-linecap="round" fill="none" />
    `;
  } else if (pose === "clap" || pose === "celebrate") {
    armsSvg = `
      <path d="M 30 65 Q 22 45 32 36" stroke="#A98467" stroke-width="11" stroke-linecap="round" fill="none" />
      <path d="M 70 65 Q 78 45 68 36" stroke="#A98467" stroke-width="11" stroke-linecap="round" fill="none" />
      <circle cx="32" cy="34" r="3" fill="#E6CCB2" />
      <circle cx="68" cy="34" r="3" fill="#E6CCB2" />
    `;
  } else if (pose === "eat") {
    armsSvg = `
      <path d="M 30 65 Q 40 68 45 65" stroke="#A98467" stroke-width="10" stroke-linecap="round" fill="none" />
      <path d="M 70 65 Q 60 68 55 65" stroke="#A98467" stroke-width="10" stroke-linecap="round" fill="none" />
      <circle cx="50" cy="65" r="9" fill="#E63946" />
      <path d="M 50 56 Q 52 52 54 50" stroke="#6F4E37" stroke-width="2" fill="none" />
      <ellipse cx="55" cy="52" rx="3.5" ry="2" fill="#2A9D8F" />
      <ellipse cx="47" cy="63" rx="2" ry="3.5" fill="#FFFFFF" opacity="0.6" />
    `;
  } else if (pose === "thinking") {
    armsSvg = `
      <path d="M 70 65 Q 68 62 58 64" stroke="#A98467" stroke-width="10" stroke-linecap="round" fill="none" />
      <path d="M 30 65 Q 22 75 28 85" stroke="#A98467" stroke-width="11" stroke-linecap="round" fill="none" />
    `;
  } else {
    armsSvg = `
      <path d="M 30 65 Q 20 75 28 86" stroke="#A98467" stroke-width="11" stroke-linecap="round" fill="none" />
      <path d="M 70 65 Q 80 75 72 86" stroke="#A98467" stroke-width="11" stroke-linecap="round" fill="none" />
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512">
  <defs>
    <radialGradient id="bodyGrad_${theme}_${pose}" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#C59B76" />
      <stop offset="100%" stop-color="#8C6239" />
    </radialGradient>
    <linearGradient id="maskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EED7C5" />
      <stop offset="100%" stop-color="#DDB892" />
    </linearGradient>
  </defs>
  <path d="M 28 45 C 20 65, 20 85, 36 94 C 50 100, 64 98, 72 90 C 82 80, 80 55, 72 45 C 65 35, 35 35, 28 45 Z" fill="url(#bodyGrad_${theme}_${pose})" />
  <ellipse cx="50" cy="74" rx="18" ry="16" fill="#F7EDE2" />
  ${armsSvg}
  <circle cx="50" cy="48" r="24" fill="url(#bodyGrad_${theme}_${pose})" />
  <path d="M 30 50 C 30 40, 44 42, 50 46 C 56 42, 70 40, 70 50 C 70 58, 58 56, 50 54 C 42 56, 30 58, 30 50 Z" fill="url(#maskGrad)" />
  <ellipse cx="39" cy="50" rx="8" ry="6.5" fill="#B08968" opacity="0.65" />
  <ellipse cx="61" cy="50" rx="8" ry="6.5" fill="#B08968" opacity="0.65" />
  <circle cx="33" cy="56" r="4.5" fill="#F4A261" opacity="0.45" />
  <circle cx="67" cy="56" r="4.5" fill="#F4A261" opacity="0.45" />
  <path d="M 47 52 Q 50 50 53 52 L 50 55 Z" fill="#4A2E1B" />
  ${faceFeaturesSvg}
  ${accessorySvg}
</svg>`;
}

function generateCozyTreehouseSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="1920" height="1080">
  <defs>
    <linearGradient id="skyCozy" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF0" />
      <stop offset="60%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#D1FAE5" />
    </linearGradient>
    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#92400E" />
    </linearGradient>
    <radialGradient id="lanternGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FDE047" stop-opacity="1" />
      <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="800" height="450" fill="url(#skyCozy)" />
  <path d="M 0 350 Q 180 260 380 340 T 800 320 L 800 450 L 0 450 Z" fill="#A7F3D0" opacity="0.6" />
  <path d="M 220 450 C 260 320, 240 200, 350 120 C 420 180, 480 300, 520 450 Z" fill="#78350F" />
  <circle cx="280" cy="120" r="100" fill="#059669" />
  <circle cx="420" cy="90" r="110" fill="#10B981" />
  <circle cx="520" cy="140" r="90" fill="#34D399" />
  <rect x="310" y="160" width="160" height="110" rx="16" fill="url(#woodGrad)" stroke="#78350F" stroke-width="4" />
  <polygon points="280,165 390,95 500,165" fill="#B45309" stroke="#78350F" stroke-width="4" />
  <circle cx="390" cy="205" r="26" fill="#FEF08A" stroke="#78350F" stroke-width="4" />
  <circle cx="390" cy="205" r="45" fill="url(#lanternGlow)" pointer-events="none" />
  <ellipse cx="120" cy="430" rx="140" ry="70" fill="#047857" />
  <ellipse cx="680" cy="430" rx="150" ry="70" fill="#047857" />
</svg>`;
}

function generateExplorerIslandSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="1920" height="1080">
  <defs>
    <linearGradient id="skyExp" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#BAE6FD" />
      <stop offset="50%" stop-color="#E0F2FE" />
      <stop offset="100%" stop-color="#FEF08A" />
    </linearGradient>
    <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#skyExp)" />
  <circle cx="680" cy="90" r="45" fill="#FBBF24" opacity="0.9" />
  <rect y="220" width="800" height="230" fill="url(#oceanGrad)" />
  <ellipse cx="380" cy="360" rx="320" ry="120" fill="#FDE68A" stroke="#D97706" stroke-width="4" />
  <circle cx="280" cy="290" r="60" fill="#059669" />
  <circle cx="350" cy="270" r="70" fill="#10B981" />
  <polygon points="460,330 520,260 580,330" fill="#F97316" stroke="#C2410C" stroke-width="3" />
</svg>`;
}

function generateStarSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="128" height="128">
  <defs>
    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>
  <polygon points="50,5 64,36 98,38 72,62 80,95 50,77 20,95 28,62 2,38 36,36" fill="url(#starGrad)" stroke="#B45309" stroke-width="3" />
  <circle cx="38" cy="28" r="3.5" fill="#FFFFFF" />
</svg>`;
}

function generateXpSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="128" height="128">
  <defs>
    <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="50%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>
  <polygon points="58,4 24,52 48,52 42,96 76,46 52,46" fill="url(#xpGrad)" stroke="#047857" stroke-width="3" />
</svg>`;
}

function generatePetFoodSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="128" height="128">
  <defs>
    <radialGradient id="appleGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#F87171" />
      <stop offset="40%" stop-color="#EF4444" />
      <stop offset="100%" stop-color="#991B1B" />
    </radialGradient>
  </defs>
  <path d="M 50 26 C 30 14, 12 36, 18 64 C 24 88, 44 94, 50 88 C 56 94, 76 88, 82 64 C 88 36, 70 14, 50 26 Z" fill="url(#appleGrad)" stroke="#7F1D1D" stroke-width="3" />
  <path d="M 50 26 Q 54 12 60 8" stroke="#78350F" stroke-width="4.5" stroke-linecap="round" fill="none" />
  <path d="M 54 18 Q 72 10 74 24 Q 60 26 54 18 Z" fill="#10B981" stroke="#047857" stroke-width="2" />
  <ellipse cx="34" cy="44" rx="7" ry="12" fill="#FFFFFF" opacity="0.55" transform="rotate(-25 34 44)" />
</svg>`;
}

function generateNodeSvg(state: string): string {
  let inner = "";
  if (state === "locked") {
    inner = `
      <circle cx="50" cy="50" r="42" fill="#CBD5E1" stroke="#94A3B8" stroke-width="4" />
      <rect x="36" y="44" width="28" height="24" rx="4" fill="#64748B" />
      <path d="M 42 44 V 36 C 42 30, 58 30, 58 36 V 44" stroke="#64748B" stroke-width="4" fill="none" />
    `;
  } else if (state === "available") {
    inner = `
      <circle cx="50" cy="50" r="42" fill="#FEF3C7" stroke="#F59E0B" stroke-width="5" />
      <circle cx="50" cy="50" r="28" fill="#FDE68A" />
      <polygon points="50,30 55,42 68,43 58,52 61,65 50,58 39,65 42,52 32,43 45,42" fill="#D97706" />
    `;
  } else if (state === "current") {
    inner = `
      <circle cx="50" cy="50" r="42" fill="#FBBF24" stroke="#FEF08A" stroke-width="6" />
      <circle cx="50" cy="50" r="30" fill="#F59E0B" />
      <polygon points="50,26 56,40 70,41 60,51 63,65 50,58 37,65 40,51 30,41 44,40" fill="#FFFFFF" />
    `;
  } else if (state === "completed") {
    inner = `
      <circle cx="50" cy="50" r="42" fill="#34D399" stroke="#A7F3D0" stroke-width="5" />
      <circle cx="50" cy="50" r="30" fill="#10B981" />
      <path d="M 36 50 L 46 60 L 64 40" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    `;
  } else if (state === "mastered") {
    inner = `
      <circle cx="50" cy="50" r="42" fill="#F59E0B" stroke="#FEF08A" stroke-width="6" />
      <polygon points="34,60 66,60 68,40 58,48 50,32 42,48 32,40" fill="#FEF08A" stroke="#B45309" stroke-width="2" />
      <circle cx="50" cy="32" r="3" fill="#EF4444" />
    `;
  } else {
    // review_due
    inner = `
      <circle cx="50" cy="50" r="42" fill="#FB7185" stroke="#FECDD3" stroke-width="5" />
      <circle cx="50" cy="50" r="30" fill="#F43F5E" />
      <path d="M 40 50 A 12 12 0 1 1 60 50 A 12 12 0 0 1 40 50" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" fill="none" />
    `;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">${inner}</svg>`;
}

function generateSceneSvg(name: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <defs>
    <linearGradient id="scGrad_${name}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#D1FAE5" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="24" fill="url(#scGrad_${name})" stroke="#FDE68A" stroke-width="4" />
  <circle cx="300" cy="200" r="120" fill="#FFFFFF" opacity="0.6" />
  <!-- Scenery Text Label -->
  <text x="300" y="210" font-size="24" font-weight="900" text-anchor="middle" fill="#78350F" font-family="sans-serif">${name.replace(/_/g, " ").toUpperCase()}</text>
  <text x="300" y="245" font-size="14" font-weight="bold" text-anchor="middle" fill="#059669" font-family="sans-serif">LƯỜI ENGLISH • GRADE 3 UNIT 1</text>
</svg>`;
}

function main() {
  console.log("Generating complete production asset tree...");

  // Mascot Folders
  const cozyMascotDir = path.join(PUBLIC_DIR, "assets/mascot/cozy");
  const explorerMascotDir = path.join(PUBLIC_DIR, "assets/mascot/explorer");
  ensureDir(cozyMascotDir);
  ensureDir(explorerMascotDir);

  const poses: Pose[] = [
    "idle",
    "hello",
    "happy",
    "thinking",
    "listening",
    "speaking",
    "reading",
    "writing",
    "encourage",
    "clap",
    "eat",
    "sleep",
    "sleeping",
    "celebrate",
    "celebrating",
  ];

  for (const pose of poses) {
    fs.writeFileSync(path.join(cozyMascotDir, `${pose}.svg`), generateSlothSvg("cozy", pose));
    fs.writeFileSync(path.join(explorerMascotDir, `${pose}.svg`), generateSlothSvg("explorer", pose));
  }

  // Worlds Folders
  const worldsDir = path.join(PUBLIC_DIR, "assets/worlds");
  ensureDir(worldsDir);
  fs.writeFileSync(path.join(worldsDir, "cozy_treehouse.svg"), generateCozyTreehouseSvg());
  fs.writeFileSync(path.join(worldsDir, "cozy_library.svg"), generateCozyTreehouseSvg());
  fs.writeFileSync(path.join(worldsDir, "explorer_adventure_map.svg"), generateExplorerIslandSvg());
  fs.writeFileSync(path.join(worldsDir, "explorer_story_forest.svg"), generateExplorerIslandSvg());
  fs.writeFileSync(path.join(worldsDir, "explorer_audio_lake.svg"), generateExplorerIslandSvg());

  // Rewards & Pets
  const rewardsDir = path.join(PUBLIC_DIR, "assets/rewards");
  const petsDir = path.join(PUBLIC_DIR, "assets/pets");
  ensureDir(rewardsDir);
  ensureDir(petsDir);
  fs.writeFileSync(path.join(rewardsDir, "star.svg"), generateStarSvg());
  fs.writeFileSync(path.join(rewardsDir, "xp.svg"), generateXpSvg());
  fs.writeFileSync(path.join(rewardsDir, "coin.svg"), generateStarSvg());
  fs.writeFileSync(path.join(rewardsDir, "pet_food.svg"), generatePetFoodSvg());
  fs.writeFileSync(path.join(rewardsDir, "badge_friendship.svg"), generateStarSvg());
  fs.writeFileSync(path.join(petsDir, "baby_sloth.svg"), generateSlothSvg("cozy", "happy"));
  fs.writeFileSync(path.join(petsDir, "egg_default.svg"), generateSlothSvg("cozy", "sleep"));
  fs.writeFileSync(path.join(petsDir, "sloth_idle.svg"), generateSlothSvg("cozy", "idle"));
  fs.writeFileSync(path.join(petsDir, "sloth_happy.svg"), generateSlothSvg("cozy", "happy"));
  fs.writeFileSync(path.join(petsDir, "sloth_proud.svg"), generateSlothSvg("cozy", "happy"));
  fs.writeFileSync(path.join(petsDir, "sloth_excited.svg"), generateSlothSvg("cozy", "celebrate"));
  fs.writeFileSync(path.join(petsDir, "sloth_sleep.svg"), generateSlothSvg("cozy", "sleep"));
  fs.writeFileSync(path.join(petsDir, "sloth_eat.svg"), generateSlothSvg("cozy", "eat"));
  fs.writeFileSync(path.join(petsDir, "sloth_think.svg"), generateSlothSvg("cozy", "thinking"));
  fs.writeFileSync(path.join(petsDir, "sloth_encourage.svg"), generateSlothSvg("cozy", "encourage"));
  fs.writeFileSync(path.join(petsDir, "sloth_celebrate.svg"), generateSlothSvg("cozy", "celebrate"));
  fs.writeFileSync(path.join(petsDir, "sloth_surprised.svg"), generateSlothSvg("cozy", "thinking"));

  // Nodes
  const nodesDir = path.join(PUBLIC_DIR, "assets/nodes");
  ensureDir(nodesDir);
  const nodeStates = ["locked", "available", "current", "completed", "mastered", "review_due"];
  for (const s of nodeStates) {
    fs.writeFileSync(path.join(nodesDir, `node_${s}.svg`), generateNodeSvg(s));
  }

  // Scenes
  const scenesDir = path.join(PUBLIC_DIR, "assets/scenes");
  ensureDir(scenesDir);
  const scenes = [
    "greeting",
    "meeting_friend",
    "asking_name",
    "listening_scene",
    "speaking_scene",
    "memory_challenge",
    "lesson_complete",
  ];
  for (const sc of scenes) {
    fs.writeFileSync(path.join(scenesDir, `${sc}.svg`), generateSceneSvg(sc));
  }

  // Icons
  const iconsDir = path.join(PUBLIC_DIR, "assets/icons");
  ensureDir(iconsDir);
  const skillIcons = ["listening", "speaking", "reading", "writing", "vocabulary", "grammar"];
  for (const sk of skillIcons) {
    fs.writeFileSync(path.join(iconsDir, `skill_${sk}.svg`), generateStarSvg());
  }

  // Placeholders (matching fallback paths)
  const placeholdersDir = path.join(PUBLIC_DIR, "assets/placeholders");
  ensureDir(placeholdersDir);
  for (const pose of poses) {
    fs.writeFileSync(path.join(placeholdersDir, `sloth_cozy_${pose}.svg`), generateSlothSvg("cozy", pose));
    fs.writeFileSync(path.join(placeholdersDir, `sloth_explorer_${pose}.svg`), generateSlothSvg("explorer", pose));
  }
  fs.writeFileSync(path.join(placeholdersDir, "world_cozy_treehouse.svg"), generateCozyTreehouseSvg());
  fs.writeFileSync(path.join(placeholdersDir, "world_cozy_library.svg"), generateCozyTreehouseSvg());
  fs.writeFileSync(path.join(placeholdersDir, "world_explorer_map.svg"), generateExplorerIslandSvg());
  fs.writeFileSync(path.join(placeholdersDir, "world_explorer_story_forest.svg"), generateExplorerIslandSvg());
  fs.writeFileSync(path.join(placeholdersDir, "world_explorer_audio_lake.svg"), generateExplorerIslandSvg());
  fs.writeFileSync(path.join(placeholdersDir, "reward_star.svg"), generateStarSvg());
  fs.writeFileSync(path.join(placeholdersDir, "reward_xp.svg"), generateXpSvg());
  fs.writeFileSync(path.join(placeholdersDir, "reward_pet_food.svg"), generatePetFoodSvg());
  fs.writeFileSync(path.join(placeholdersDir, "reward_coin.svg"), generateStarSvg());
  fs.writeFileSync(path.join(placeholdersDir, "baby_sloth.svg"), generateSlothSvg("cozy", "happy"));
  fs.writeFileSync(path.join(placeholdersDir, "egg_default.svg"), generateSlothSvg("cozy", "sleep"));
  fs.writeFileSync(path.join(placeholdersDir, "sloth_idle.svg"), generateSlothSvg("cozy", "idle"));
  fs.writeFileSync(path.join(placeholdersDir, "sloth_happy.svg"), generateSlothSvg("cozy", "happy"));
  fs.writeFileSync(path.join(placeholdersDir, "sloth_proud.svg"), generateSlothSvg("cozy", "happy"));
  fs.writeFileSync(path.join(placeholdersDir, "sloth_excited.svg"), generateSlothSvg("cozy", "celebrate"));
  fs.writeFileSync(path.join(placeholdersDir, "sloth_sleep.svg"), generateSlothSvg("cozy", "sleep"));
  fs.writeFileSync(path.join(placeholdersDir, "sloth_eat.svg"), generateSlothSvg("cozy", "eat"));
  fs.writeFileSync(path.join(placeholdersDir, "sloth_think.svg"), generateSlothSvg("cozy", "thinking"));
  fs.writeFileSync(path.join(placeholdersDir, "sloth_encourage.svg"), generateSlothSvg("cozy", "encourage"));
  fs.writeFileSync(path.join(placeholdersDir, "sloth_celebrate.svg"), generateSlothSvg("cozy", "celebrate"));
  fs.writeFileSync(path.join(placeholdersDir, "sloth_surprised.svg"), generateSlothSvg("cozy", "thinking"));
  for (const sk of skillIcons) {
    fs.writeFileSync(path.join(placeholdersDir, `skill_${sk}.svg`), generateStarSvg());
  }

  console.log("✓ All SVG assets and fallbacks generated successfully!");
}

main();
