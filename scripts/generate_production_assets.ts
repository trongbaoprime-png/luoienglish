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
  | "playing_game"
  | "level_up"
  | "eat"
  | "eating"
  | "sleep"
  | "sleeping"
  | "celebrate"
  | "celebrating"
  | "encourage"
  | "clap";

/**
 * Generates 3D-styled Aviator Chú Lười (Goggles on head, soft clay volumetric shading)
 */
function generateAviatorSlothSvg(theme: Theme, pose: Pose): string {
  const isExplorer = theme === "explorer";
  const bodyColor1 = isExplorer ? "#C08A3E" : "#B07D4F";
  const bodyColor2 = isExplorer ? "#8C5E28" : "#7A4E27";
  const strapColor = isExplorer ? "#5A3A1A" : "#6B4423";
  const goggleRim = "#D4A373";
  const lensGlass = "#70D6FF";

  // Aviator Goggles Headgear SVG
  const gogglesSvg = `
    <!-- Goggle Leather Strap -->
    <path d="M 22 34 C 36 24, 64 24, 78 34" stroke="${strapColor}" stroke-width="6" stroke-linecap="round" fill="none" />
    <path d="M 22 34 C 36 24, 64 24, 78 34" stroke="#422810" stroke-width="2" stroke-linecap="round" fill="none" />
    <!-- Left Goggle Rim & Lens -->
    <ellipse cx="36" cy="28" rx="12" ry="10" fill="${goggleRim}" stroke="#5A3A1A" stroke-width="2" />
    <ellipse cx="36" cy="28" rx="9" ry="7" fill="${lensGlass}" />
    <path d="M 32 25 Q 36 23 40 25" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.85" />
    <!-- Bridge -->
    <rect x="46" y="26" width="8" height="4" rx="2" fill="#5A3A1A" />
    <!-- Right Goggle Rim & Lens -->
    <ellipse cx="64" cy="28" rx="12" ry="10" fill="${goggleRim}" stroke="#5A3A1A" stroke-width="2" />
    <ellipse cx="64" cy="28" rx="9" ry="7" fill="${lensGlass}" />
    <path d="M 60 25 Q 64 23 68 25" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.85" />
  `;

  // Custom Accessories & Props per Pose
  let propsSvg = "";
  let armsSvg = "";
  let faceSvg = "";

  if (pose === "reading") {
    // Lying down reading blue book
    propsSvg = `
      <!-- Open Blue Book -->
      <g transform="translate(18, 62)">
        <polygon points="12,18 32,24 32,4 12,0" fill="#1E88E5" stroke="#0D47A1" stroke-width="1.5" />
        <polygon points="52,18 32,24 32,4 52,0" fill="#2196F3" stroke="#0D47A1" stroke-width="1.5" />
        <polygon points="14,16 31,21 31,5 14,2" fill="#FFFFFF" />
        <polygon points="50,16 33,21 33,5 50,2" fill="#FFFDE7" />
        <line x1="18" y1="8" x2="28" y2="11" stroke="#90CAF9" stroke-width="1.5" />
        <line x1="18" y1="12" x2="27" y2="15" stroke="#90CAF9" stroke-width="1.5" />
        <line x1="36" y1="11" x2="46" y2="8" stroke="#90CAF9" stroke-width="1.5" />
        <line x1="36" y1="15" x2="45" y2="12" stroke="#90CAF9" stroke-width="1.5" />
        <!-- Star emblem on cover -->
        <circle cx="32" cy="14" r="3" fill="#FFD166" />
      </g>
    `;
    armsSvg = `
      <path d="M 28 66 Q 34 76 42 74" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
      <path d="M 72 66 Q 66 76 58 74" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
    `;
    faceSvg = `
      <ellipse cx="40" cy="50" rx="5" ry="6" fill="#2D1E12" />
      <circle cx="42" cy="48" r="2" fill="#FFFFFF" />
      <ellipse cx="60" cy="50" rx="5" ry="6" fill="#2D1E12" />
      <circle cx="62" cy="48" r="2" fill="#FFFFFF" />
      <path d="M 44 58 Q 50 64 56 58" stroke="#2D1E12" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `;
  } else if (pose === "listening") {
    // Big blue headphones
    propsSvg = `
      <!-- Blue Headphones Band -->
      <path d="M 20 45 C 20 18, 80 18, 80 45" stroke="#1E88E5" stroke-width="6" stroke-linecap="round" fill="none" />
      <!-- Left Ear Cup -->
      <rect x="14" y="38" width="10" height="20" rx="5" fill="#1565C0" stroke="#0D47A1" stroke-width="2" />
      <ellipse cx="19" cy="48" rx="2" ry="6" fill="#64B5F6" />
      <!-- Right Ear Cup -->
      <rect x="76" y="38" width="10" height="20" rx="5" fill="#1565C0" stroke="#0D47A1" stroke-width="2" />
      <ellipse cx="81" cy="48" rx="2" ry="6" fill="#64B5F6" />
      <!-- Musical Notes Floating -->
      <text x="84" y="30" font-size="16" fill="#22C55E" font-weight="black">♪</text>
      <text x="10" y="28" font-size="14" fill="#FF8A3D" font-weight="black">♫</text>
    `;
    armsSvg = `
      <path d="M 28 66 Q 16 54 22 46" stroke="${bodyColor1}" stroke-width="9" stroke-linecap="round" fill="none" />
      <path d="M 72 66 Q 84 54 78 46" stroke="${bodyColor1}" stroke-width="9" stroke-linecap="round" fill="none" />
    `;
    faceSvg = `
      <path d="M 35 48 Q 40 43 45 48" stroke="#2D1E12" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M 55 48 Q 60 43 65 48" stroke="#2D1E12" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M 43 58 Q 50 66 57 58 Z" fill="#E63946" stroke="#2D1E12" stroke-width="1.5" />
    `;
  } else if (pose === "speaking") {
    // Holding microphone
    propsSvg = `
      <!-- Microphone -->
      <g transform="translate(62, 54)">
        <rect x="0" y="10" width="6" height="18" rx="3" fill="#374151" />
        <ellipse cx="3" cy="8" rx="7" ry="9" fill="#0EA5E9" stroke="#0284C7" stroke-width="2" />
        <line x1="0" y1="6" x2="6" y2="6" stroke="#E0F2FE" stroke-width="1" />
        <line x1="0" y1="10" x2="6" y2="10" stroke="#E0F2FE" stroke-width="1" />
      </g>
    `;
    armsSvg = `
      <path d="M 28 66 Q 20 76 26 86" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
      <path d="M 72 66 Q 74 60 66 62" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
    `;
    faceSvg = `
      <ellipse cx="40" cy="49" rx="5" ry="6.5" fill="#2D1E12" />
      <circle cx="42" cy="47" r="2.2" fill="#FFFFFF" />
      <ellipse cx="60" cy="49" rx="5" ry="6.5" fill="#2D1E12" />
      <circle cx="62" cy="47" r="2.2" fill="#FFFFFF" />
      <ellipse cx="50" cy="59" rx="6" ry="6.5" fill="#E63946" stroke="#2D1E12" stroke-width="1.5" />
      <path d="M 46 61 Q 50 64 54 61" fill="#FFB703" />
    `;
  } else if (pose === "playing_game") {
    // Holding gamepad
    propsSvg = `
      <!-- Golden Gamepad -->
      <g transform="translate(32, 65)">
        <rect x="0" y="0" width="36" height="20" rx="8" fill="#FFD166" stroke="#D97706" stroke-width="2" />
        <!-- D-pad -->
        <polygon points="6,10 10,7 10,13" fill="#4B5563" />
        <polygon points="14,10 10,7 10,13" fill="#4B5563" />
        <!-- Action buttons -->
        <circle cx="26" cy="8" r="2.5" fill="#EF4444" />
        <circle cx="30" cy="12" r="2.5" fill="#22C55E" />
      </g>
    `;
    armsSvg = `
      <path d="M 28 66 Q 34 72 38 68" stroke="${bodyColor1}" stroke-width="9" stroke-linecap="round" fill="none" />
      <path d="M 72 66 Q 66 72 62 68" stroke="${bodyColor1}" stroke-width="9" stroke-linecap="round" fill="none" />
    `;
    faceSvg = `
      <ellipse cx="40" cy="48" rx="5" ry="6.5" fill="#2D1E12" />
      <circle cx="42" cy="46" r="2" fill="#FFFFFF" />
      <ellipse cx="60" cy="48" rx="5" ry="6.5" fill="#2D1E12" />
      <circle cx="62" cy="46" r="2" fill="#FFFFFF" />
      <path d="M 44 58 Q 50 63 56 58" stroke="#2D1E12" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `;
  } else if (pose === "level_up" || pose === "celebrate" || pose === "celebrating") {
    // Golden Trophy & Celebration
    propsSvg = `
      <!-- Golden Trophy -->
      <g transform="translate(62, 35)">
        <path d="M 4 8 C 4 18, 20 18, 20 8 Z" fill="#FFD166" stroke="#D97706" stroke-width="2" />
        <path d="M 12 18 L 12 24" stroke="#D97706" stroke-width="4" />
        <rect x="6" y="24" width="12" height="4" rx="2" fill="#B45309" />
        <path d="M 4 10 C 0 10, 0 14, 4 14" stroke="#D97706" stroke-width="2" fill="none" />
        <path d="M 20 10 C 24 10, 24 14, 20 14" stroke="#D97706" stroke-width="2" fill="none" />
        <polygon points="12,9 13.5,12.5 17,12.5 14,14.5 15,18 12,16 9,18 10,14.5 7,12.5 10.5,12.5" fill="#FFFFFF" />
      </g>
      <!-- Confetti -->
      <circle cx="20" cy="20" r="3" fill="#EF4444" />
      <circle cx="82" cy="18" r="3.5" fill="#22C55E" />
      <rect x="25" y="10" width="4" height="4" fill="#3B82F6" transform="rotate(25 25 10)" />
      <rect x="75" y="10" width="4" height="4" fill="#F59E0B" transform="rotate(45 75 10)" />
    `;
    armsSvg = `
      <path d="M 28 66 Q 18 46 26 36" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
      <path d="M 72 66 Q 78 48 70 38" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
    `;
    faceSvg = `
      <path d="M 34 49 Q 40 43 46 49" stroke="#2D1E12" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M 54 49 Q 60 43 66 49" stroke="#2D1E12" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M 41 58 Q 50 68 59 58 Z" fill="#E63946" stroke="#2D1E12" stroke-width="1.5" />
    `;
  } else if (pose === "sleep" || pose === "sleeping") {
    // Sleeping curled up on tree branch
    propsSvg = `
      <!-- Tree Branch -->
      <path d="M 0 88 Q 50 82 100 88" stroke="#78350F" stroke-width="12" stroke-linecap="round" fill="none" />
      <path d="M 12 85 Q 18 78 24 82" stroke="#10B981" stroke-width="5" stroke-linecap="round" fill="none" />
      <path d="M 80 85 Q 86 78 92 82" stroke="#10B981" stroke-width="5" stroke-linecap="round" fill="none" />
      <!-- Zzz Letters -->
      <text x="76" y="32" font-size="14" font-weight="black" fill="#44B5E2" font-family="sans-serif">z</text>
      <text x="84" y="20" font-size="18" font-weight="black" fill="#0284C7" font-family="sans-serif">Z</text>
    `;
    armsSvg = `
      <path d="M 30 68 Q 40 78 50 76" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
      <path d="M 70 68 Q 60 78 50 76" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
    `;
    faceSvg = `
      <path d="M 36 50 Q 42 56 46 50" stroke="#2D1E12" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M 54 50 Q 58 56 64 50" stroke="#2D1E12" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M 47 58 Q 50 61 53 58" stroke="#2D1E12" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `;
  } else if (pose === "hello") {
    // Waving hand
    armsSvg = `
      <path d="M 70 65 Q 88 48 84 32" stroke="${bodyColor1}" stroke-width="11" stroke-linecap="round" fill="none" />
      <circle cx="84" cy="30" r="3" fill="#E6CCB2" />
      <circle cx="88" cy="33" r="3" fill="#E6CCB2" />
      <path d="M 30 65 Q 20 75 28 86" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
    `;
    faceSvg = `
      <ellipse cx="40" cy="49" rx="5" ry="6.5" fill="#2D1E12" />
      <circle cx="42" cy="47" r="2.2" fill="#FFFFFF" />
      <ellipse cx="60" cy="49" rx="5" ry="6.5" fill="#2D1E12" />
      <circle cx="62" cy="47" r="2.2" fill="#FFFFFF" />
      <path d="M 42 58 Q 50 66 58 58 Z" fill="#E63946" stroke="#2D1E12" stroke-width="1.5" />
    `;
  } else if (pose === "thinking") {
    propsSvg = `
      <circle cx="78" cy="36" r="4" fill="#FFD166" />
      <circle cx="86" cy="26" r="7" fill="#FF8A3D" />
      <text x="83" y="30" font-size="10" font-weight="black" fill="#FFFFFF" font-family="sans-serif">?</text>
    `;
    armsSvg = `
      <path d="M 70 65 Q 66 60 56 62" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
      <path d="M 30 65 Q 20 75 28 86" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
    `;
    faceSvg = `
      <ellipse cx="40" cy="48" rx="5" ry="6.5" fill="#2D1E12" />
      <circle cx="42" cy="46" r="2" fill="#FFFFFF" />
      <ellipse cx="60" cy="48" rx="5" ry="6.5" fill="#2D1E12" />
      <circle cx="62" cy="46" r="2" fill="#FFFFFF" />
      <path d="M 45 60 Q 50 63 55 59" stroke="#2D1E12" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `;
  } else {
    // Default Idle / Happy
    armsSvg = `
      <path d="M 30 65 Q 20 75 28 86" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
      <path d="M 70 65 Q 80 75 72 86" stroke="${bodyColor1}" stroke-width="10" stroke-linecap="round" fill="none" />
    `;
    faceSvg = `
      <ellipse cx="40" cy="49" rx="5" ry="6.5" fill="#2D1E12" />
      <circle cx="42" cy="47" r="2.2" fill="#FFFFFF" />
      <circle cx="38" cy="51" r="1.2" fill="#FFFFFF" />
      <ellipse cx="60" cy="49" rx="5" ry="6.5" fill="#2D1E12" />
      <circle cx="62" cy="47" r="2.2" fill="#FFFFFF" />
      <circle cx="58" cy="51" r="1.2" fill="#FFFFFF" />
      <path d="M 43 58 Q 50 65 57 58" stroke="#2D1E12" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512">
  <defs>
    <radialGradient id="slothBody_${theme}_${pose}" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="${bodyColor1}" />
      <stop offset="100%" stop-color="${bodyColor2}" />
    </radialGradient>
    <linearGradient id="slothMask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3E0" />
      <stop offset="100%" stop-color="#FFE0B2" />
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#3D2619" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Body Shadow -->
  <ellipse cx="50" cy="94" rx="28" ry="6" fill="#3D2619" opacity="0.2" />

  <!-- Sloth Pear Body -->
  <path d="M 28 45 C 18 65, 18 85, 36 94 C 50 100, 64 98, 72 90 C 82 80, 82 55, 72 45 C 65 35, 35 35, 28 45 Z" fill="url(#slothBody_${theme}_${pose})" filter="url(#softShadow)" />

  <!-- Fluffy Belly -->
  <ellipse cx="50" cy="74" rx="18" ry="16" fill="#FFF8E7" />

  <!-- Arms -->
  ${armsSvg}

  <!-- Head -->
  <circle cx="50" cy="48" r="25" fill="url(#slothBody_${theme}_${pose})" />

  <!-- Cream Face Mask -->
  <path d="M 30 50 C 30 40, 44 42, 50 46 C 56 42, 70 40, 70 50 C 70 58, 58 56, 50 54 C 42 56, 30 58, 30 50 Z" fill="url(#slothMask)" />

  <!-- Dark Chocolate Eye Patches -->
  <ellipse cx="39" cy="49" rx="8" ry="6.5" fill="#5D3A1A" opacity="0.75" />
  <ellipse cx="61" cy="49" rx="8" ry="6.5" fill="#5D3A1A" opacity="0.75" />

  <!-- Rosy Cheeks -->
  <circle cx="32" cy="55" r="4.5" fill="#FF8A3D" opacity="0.5" />
  <circle cx="68" cy="55" r="4.5" fill="#FF8A3D" opacity="0.5" />

  <!-- Cute Nose -->
  <path d="M 47 51 Q 50 49 53 51 L 50 54 Z" fill="#2D1E12" />

  <!-- Facial Expressions -->
  ${faceSvg}

  <!-- Signature Aviator Goggles -->
  ${gogglesSvg}

  <!-- Props (Books, Headphones, Gamepads, etc.) -->
  ${propsSvg}
</svg>`;
}

/**
 * Generates 3D Floating Island Illustrations
 */
function generateFloatingIslandSvg(name: string, title: string, subtitle: string, mainColor: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="800" height="600">
  <defs>
    <linearGradient id="islandTop_${name}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#81C784" />
      <stop offset="100%" stop-color="#388E3C" />
    </linearGradient>
    <linearGradient id="islandRock_${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8D6E63" />
      <stop offset="100%" stop-color="#4E342E" />
    </linearGradient>
    <linearGradient id="crystalGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#44B5E2" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
  </defs>

  <!-- Puffy Floating Clouds -->
  <ellipse cx="60" cy="220" rx="40" ry="18" fill="#FFFFFF" opacity="0.85" />
  <ellipse cx="340" cy="180" rx="45" ry="20" fill="#FFFFFF" opacity="0.85" />

  <!-- 3D Floating Island Rock Base -->
  <polygon points="60,150 200,280 340,150 200,120" fill="url(#islandRock_${name})" />
  <!-- Strata & Roots -->
  <polygon points="120,160 200,260 280,160" fill="#3E2723" opacity="0.6" />
  <!-- Hanging Vines -->
  <path d="M 100 155 Q 110 185 105 205" stroke="#4CAF50" stroke-width="4" stroke-linecap="round" fill="none" />
  <path d="M 290 155 Q 280 190 285 210" stroke="#4CAF50" stroke-width="4" stroke-linecap="round" fill="none" />

  <!-- Lush Green Island Surface -->
  <ellipse cx="200" cy="140" rx="140" ry="45" fill="url(#islandTop_${name})" stroke="#C8E6C9" stroke-width="4" />

  <!-- Iconic Building / Feature on Island -->
  <g transform="translate(140, 50)">
    <!-- Castle / Structure -->
    <rect x="20" y="30" width="80" height="60" rx="8" fill="#FFFFFF" stroke="#374151" stroke-width="3" />
    <polygon points="10,30 60,-5 110,30" fill="${mainColor}" stroke="#374151" stroke-width="3" />
    <rect x="45" y="55" width="30" height="35" rx="15" fill="#795548" />
    <circle cx="60" cy="20" r="10" fill="#FFD166" stroke="#374151" stroke-width="2" />
  </g>

  <!-- Floating Crystal Core -->
  <polygon points="200,250 208,265 200,280 192,265" fill="url(#crystalGlow)" />

  <!-- Text Banner -->
  <rect x="80" y="240" width="240" height="48" rx="24" fill="#FFFFFF" stroke="#FFD166" stroke-width="4" />
  <text x="200" y="262" font-size="16" font-weight="900" text-anchor="middle" fill="#3D2619" font-family="sans-serif">${title}</text>
  <text x="200" y="278" font-size="11" font-weight="700" text-anchor="middle" fill="#059669" font-family="sans-serif">${subtitle}</text>
</svg>`;
}

/**
 * Generates 3D Pet Companion SVG
 */
function generatePetSvg(petName: string, color1: string, color2: string, earType: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="256" height="256">
  <defs>
    <radialGradient id="petGrad_${petName}" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="${color1}" />
      <stop offset="100%" stop-color="${color2}" />
    </radialGradient>
  </defs>
  <!-- Body -->
  <circle cx="50" cy="55" r="32" fill="url(#petGrad_${petName})" />
  <ellipse cx="50" cy="65" rx="20" ry="16" fill="#FFFFFF" opacity="0.6" />
  <!-- Eyes -->
  <ellipse cx="40" cy="50" rx="4.5" ry="6" fill="#1F2937" />
  <circle cx="42" cy="48" r="2" fill="#FFFFFF" />
  <ellipse cx="60" cy="50" rx="4.5" ry="6" fill="#1F2937" />
  <circle cx="62" cy="48" r="2" fill="#FFFFFF" />
  <!-- Cheeks -->
  <circle cx="32" cy="56" r="4" fill="#FF8A3D" opacity="0.6" />
  <circle cx="68" cy="56" r="4" fill="#FF8A3D" opacity="0.6" />
  <!-- Nose & Mouth -->
  <circle cx="50" cy="56" r="2" fill="#1F2937" />
  <path d="M 46 60 Q 50 64 54 60" stroke="#1F2937" stroke-width="2" stroke-linecap="round" fill="none" />
  <!-- Ears -->
  <ellipse cx="25" cy="30" rx="10" ry="14" fill="${color2}" transform="rotate(-20 25 30)" />
  <ellipse cx="75" cy="30" rx="10" ry="14" fill="${color2}" transform="rotate(20 75 30)" />
</svg>`;
}

function main() {
  console.log("Generating 3D Aviator Chú Lười & Floating Island Assets...");

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
    "playing_game",
    "level_up",
    "eat",
    "eating",
    "sleep",
    "sleeping",
    "celebrate",
    "celebrating",
    "encourage",
    "clap",
  ];

  for (const pose of poses) {
    fs.writeFileSync(path.join(cozyMascotDir, `${pose}.svg`), generateAviatorSlothSvg("cozy", pose));
    fs.writeFileSync(path.join(explorerMascotDir, `${pose}.svg`), generateAviatorSlothSvg("explorer", pose));
  }

  // Floating Islands
  const islandsDir = path.join(PUBLIC_DIR, "assets/islands");
  ensureDir(islandsDir);
  fs.writeFileSync(
    path.join(islandsDir, "english_town.svg"),
    generateFloatingIslandSvg("english_town", "English Town", "Học theo chương trình", "#FF6F59")
  );
  fs.writeFileSync(
    path.join(islandsDir, "conversation_city.svg"),
    generateFloatingIslandSvg("conversation_city", "Conversation City", "Nói chuyện AI", "#0EA5E9")
  );
  fs.writeFileSync(
    path.join(islandsDir, "game_land.svg"),
    generateFloatingIslandSvg("game_land", "Game Land", "Vừa học vừa chơi", "#FFD166")
  );
  fs.writeFileSync(
    path.join(islandsDir, "story_forest.svg"),
    generateFloatingIslandSvg("story_forest", "Story Forest", "Đọc truyện tương tác", "#10B981")
  );
  fs.writeFileSync(
    path.join(islandsDir, "audio_lake.svg"),
    generateFloatingIslandSvg("audio_lake", "Audio Lake", "Nghe podcast & nhạc", "#8B5CF6")
  );
  fs.writeFileSync(
    path.join(islandsDir, "science_island.svg"),
    generateFloatingIslandSvg("science_island", "Science Island", "Khám phá khoa học", "#F97316")
  );

  // Pets
  const petsDir = path.join(PUBLIC_DIR, "assets/pets");
  ensureDir(petsDir);
  fs.writeFileSync(path.join(petsDir, "bong_may.svg"), generatePetSvg("bong_may", "#F8FAFC", "#E2E8F0", "dog"));
  fs.writeFileSync(path.join(petsDir, "hat_dau.svg"), generatePetSvg("hat_dau", "#86EFAC", "#22C55E", "sprout"));
  fs.writeFileSync(path.join(petsDir, "sao_sao.svg"), generatePetSvg("sao_sao", "#FDE047", "#EAB308", "cat"));
  fs.writeFileSync(path.join(petsDir, "mochi.svg"), generatePetSvg("mochi", "#F472B6", "#DB2777", "bunny"));
  fs.writeFileSync(path.join(petsDir, "cacao.svg"), generatePetSvg("cacao", "#D97706", "#92400E", "bear"));

  console.log("✓ All 3D Aviator Chú Lười, Floating Islands, and Pet assets generated successfully!");
}

main();
