// High fidelity retinal fundus visualizations matching Reference Image 1 & 2

export function generateFundusSvg(grade: 0 | 1 | 2 | 3 | 4, isGradCam: boolean = false, overlayOnly: boolean = false): string {
  // Return SVG as data URI
  const size = 500;
  
  if (overlayOnly) {
    // Just the Grad-CAM thermal overlay
    let heatmapSvg = '';
    if (grade === 0) {
      heatmapSvg = `
        <radialGradient id="camGradNormal" cx="45%" cy="50%" r="35%">
          <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.5" />
          <stop offset="60%" stop-color="#06B6D4" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#1E1B4B" stop-opacity="0" />
        </radialGradient>
        <circle cx="225" cy="250" r="160" fill="url(#camGradNormal)" />
      `;
    } else if (grade === 1) {
      heatmapSvg = `
        <radialGradient id="camGradMild" cx="55%" cy="45%" r="25%">
          <stop offset="0%" stop-color="#EF4444" stop-opacity="0.85" />
          <stop offset="40%" stop-color="#F59E0B" stop-opacity="0.6" />
          <stop offset="80%" stop-color="#10B981" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0" />
        </radialGradient>
        <circle cx="275" cy="225" r="90" fill="url(#camGradMild)" />
      `;
    } else if (grade === 2) {
      // Moderate (matches Reference Image 1 floating card)
      heatmapSvg = `
        <radialGradient id="camGradMod1" cx="62%" cy="48%" r="32%">
          <stop offset="0%" stop-color="#EF4444" stop-opacity="0.9" />
          <stop offset="35%" stop-color="#F59E0B" stop-opacity="0.75" />
          <stop offset="65%" stop-color="#10B981" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="camGradMod2" cx="38%" cy="65%" r="28%">
          <stop offset="0%" stop-color="#F97316" stop-opacity="0.85" />
          <stop offset="45%" stop-color="#FBBF24" stop-opacity="0.5" />
          <stop offset="80%" stop-color="#06B6D4" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#1E3A8A" stop-opacity="0" />
        </radialGradient>
        <circle cx="310" cy="240" r="140" fill="url(#camGradMod1)" />
        <circle cx="190" cy="325" r="110" fill="url(#camGradMod2)" />
      `;
    } else if (grade === 3) {
      heatmapSvg = `
        <radialGradient id="camGradSev1" cx="50%" cy="35%" r="40%">
          <stop offset="0%" stop-color="#DC2626" stop-opacity="0.95" />
          <stop offset="40%" stop-color="#EA580C" stop-opacity="0.75" />
          <stop offset="70%" stop-color="#EAB308" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="camGradSev2" cx="65%" cy="68%" r="36%">
          <stop offset="0%" stop-color="#EF4444" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.6" />
          <stop offset="80%" stop-color="#0D9488" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#1E1B4B" stop-opacity="0" />
        </radialGradient>
        <circle cx="250" cy="175" r="170" fill="url(#camGradSev1)" />
        <circle cx="325" cy="340" r="140" fill="url(#camGradSev2)" />
      `;
    } else {
      // Proliferative
      heatmapSvg = `
        <radialGradient id="camGradPdr1" cx="30%" cy="50%" r="45%">
          <stop offset="0%" stop-color="#991B1B" stop-opacity="0.95" />
          <stop offset="30%" stop-color="#DC2626" stop-opacity="0.85" />
          <stop offset="60%" stop-color="#F59E0B" stop-opacity="0.6" />
          <stop offset="90%" stop-color="#0284C7" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#0F172A" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="camGradPdr2" cx="70%" cy="40%" r="40%">
          <stop offset="0%" stop-color="#B91C1C" stop-opacity="0.9" />
          <stop offset="40%" stop-color="#EA580C" stop-opacity="0.7" />
          <stop offset="75%" stop-color="#10B981" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#0F172A" stop-opacity="0" />
        </radialGradient>
        <circle cx="150" cy="250" r="190" fill="url(#camGradPdr1)" />
        <circle cx="350" cy="200" r="160" fill="url(#camGradPdr2)" />
      `;
    }

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
      <defs>
        <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <g filter="url(#blurFilter)">
        ${heatmapSvg}
      </g>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  }

  // Base Retinal Fundus (Realistic Ophthalmology representation)
  // Deep orange-red background, dark macula, bright optic disc, arcade vessels
  let lesionsSvg = '';
  if (grade === 1) {
    // Mild: Small red microaneurysms
    lesionsSvg = `
      <g fill="#991B1B">
        <circle cx="270" cy="230" r="2.5" />
        <circle cx="285" cy="245" r="2" />
        <circle cx="260" cy="260" r="2.5" />
        <circle cx="310" cy="220" r="2" />
        <circle cx="240" cy="280" r="1.8" />
      </g>
    `;
  } else if (grade === 2) {
    // Moderate: Microaneurysms + dot hemorrhages + yellow hard exudates
    lesionsSvg = `
      <!-- Microaneurysms & Blot hemorrhages -->
      <g fill="#881337">
        <circle cx="265" cy="220" r="3" />
        <circle cx="285" cy="240" r="4.5" />
        <circle cx="310" cy="210" r="3.5" />
        <circle cx="240" cy="290" r="4" />
        <ellipse cx="295" cy="275" rx="5" ry="3" />
        <circle cx="330" cy="260" r="3" />
        <circle cx="220" cy="270" r="3" />
      </g>
      <!-- Hard Exudates (waxy yellow lipid rings) -->
      <g fill="#FEF08A" stroke="#FBBF24" stroke-width="0.8">
        <circle cx="275" cy="235" r="2" />
        <circle cx="282" cy="233" r="1.8" />
        <circle cx="278" cy="240" r="2.2" />
        <circle cx="320" cy="245" r="2" />
        <circle cx="326" cy="248" r="2.5" />
        <circle cx="318" cy="252" r="1.7" />
        <circle cx="305" cy="295" r="2.4" />
        <circle cx="312" cy="298" r="1.9" />
      </g>
    `;
  } else if (grade === 3) {
    // Severe: Multiple quadrants of large blot hemorrhages, cotton wool spots, venous beading
    lesionsSvg = `
      <!-- Deep Blot Hemorrhages -->
      <g fill="#7F1D1D">
        <ellipse cx="240" cy="180" rx="9" ry="6" />
        <ellipse cx="280" cy="160" rx="12" ry="7" />
        <ellipse cx="330" cy="230" rx="14" ry="9" />
        <ellipse cx="360" cy="280" rx="10" ry="7" />
        <ellipse cx="210" cy="330" rx="13" ry="8" />
        <ellipse cx="260" cy="350" rx="15" ry="9" />
        <ellipse cx="310" cy="360" rx="11" ry="6" />
        <circle cx="270" cy="210" r="5" />
        <circle cx="300" cy="240" r="6" />
      </g>
      <!-- Cotton Wool Spots (white/pale fluffy ischemia) -->
      <g fill="#FEF3C7" opacity="0.85" filter="url(#cwsBlur)">
        <ellipse cx="260" cy="190" rx="8" ry="5" />
        <ellipse cx="315" cy="200" rx="10" ry="6" />
        <ellipse cx="290" cy="310" rx="9" ry="6" />
      </g>
      <!-- Hard Exudates -->
      <g fill="#FDE047" opacity="0.9">
        <circle cx="280" cy="225" r="2.5" />
        <circle cx="285" cy="228" r="2.2" />
        <circle cx="275" cy="230" r="2.8" />
        <circle cx="340" cy="250" r="3" />
        <circle cx="346" cy="253" r="2" />
      </g>
    `;
  } else if (grade === 4) {
    // Proliferative: Extensive neovascularization fronds, pre-retinal hemorrhage
    lesionsSvg = `
      <!-- Large Vitreous/Preretinal Hemorrhage pool -->
      <path d="M 170 330 Q 220 310 280 325 T 380 340 A 180 180 0 0 1 170 330 Z" fill="#450A0A" opacity="0.9" />
      <!-- Extensive intraretinal hemorrhages -->
      <g fill="#7F1D1D">
        <ellipse cx="220" cy="170" rx="14" ry="8" />
        <ellipse cx="320" cy="180" rx="16" ry="10" />
        <ellipse cx="360" cy="240" rx="18" ry="11" />
        <ellipse cx="260" cy="280" rx="15" ry="9" />
      </g>
      <!-- Neovascularization (fine looping tangled vessels at disc & arcades) -->
      <g stroke="#991B1B" stroke-width="1.2" fill="none">
        <path d="M 140 240 Q 155 230 160 245 T 175 240 T 185 255" />
        <path d="M 145 250 Q 160 260 170 250 T 180 265" />
        <path d="M 300 200 Q 315 190 325 205 T 340 195" />
        <path d="M 290 300 Q 305 315 315 305 T 330 320" />
      </g>
      <!-- Fibrous proliferation bands -->
      <path d="M 140 230 Q 190 220 240 235" stroke="#FEF3C7" stroke-width="2.5" opacity="0.6" fill="none" />
    `;
  }

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
    <defs>
      <!-- Retinal Background Gradient -->
      <radialGradient id="retinaBg" cx="48%" cy="50%" r="52%">
        <stop offset="0%" stop-color="#C2410C" />
        <stop offset="30%" stop-color="#9A3412" />
        <stop offset="70%" stop-color="#7C2D12" />
        <stop offset="92%" stop-color="#431407" />
        <stop offset="100%" stop-color="#1C0A04" />
      </radialGradient>
      <!-- Optic Disc (Nasal side) -->
      <radialGradient id="opticDisc" cx="45%" cy="45%" r="50%">
        <stop offset="0%" stop-color="#FEF08A" />
        <stop offset="45%" stop-color="#FCD34D" />
        <stop offset="85%" stop-color="#F97316" />
        <stop offset="100%" stop-color="#EA580C" />
      </radialGradient>
      <!-- Macular Area (Fovea centralis) -->
      <radialGradient id="foveaGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#431407" stop-opacity="0.85" />
        <stop offset="60%" stop-color="#7C2D12" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#9A3412" stop-opacity="0" />
      </radialGradient>
      <filter id="cwsBlur">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
      <!-- Peripheral Vignette/Mask -->
      <clipPath id="circleClip">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 4}" />
      </clipPath>
    </defs>

    <!-- Fundus Circle Container -->
    <g clip-path="url(#circleClip)">
      <rect width="${size}" height="${size}" fill="#0A0A0A" />
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 6}" fill="url(#retinaBg)" />

      <!-- Optic Disc (Nasal side: x=145, y=250) -->
      <ellipse cx="145" cy="250" rx="34" ry="42" fill="url(#opticDisc)" opacity="0.95" />
      <ellipse cx="148" cy="250" rx="16" ry="22" fill="#FEF9C3" opacity="0.8" />

      <!-- Retinal Vascular Arcades emerging from Disc -->
      <!-- Superior Temporal Arcade -->
      <path d="M 145 235 C 160 170, 220 120, 310 135 C 380 148, 430 190, 470 230" stroke="#7F1D1D" stroke-width="7.5" fill="none" stroke-linecap="round" opacity="0.9" />
      <path d="M 145 235 C 160 170, 220 120, 310 135 C 380 148, 430 190, 470 230" stroke="#DC2626" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.85" />
      
      <!-- Inferior Temporal Arcade -->
      <path d="M 145 265 C 165 325, 230 380, 320 365 C 390 350, 440 310, 470 270" stroke="#7F1D1D" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.9" />
      <path d="M 145 265 C 165 325, 230 380, 320 365 C 390 350, 440 310, 470 270" stroke="#DC2626" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.85" />

      <!-- Nasal Vessels -->
      <path d="M 135 240 C 105 210, 70 195, 35 190" stroke="#991B1B" stroke-width="4.5" fill="none" opacity="0.8" />
      <path d="M 135 260 C 100 285, 65 315, 30 320" stroke="#991B1B" stroke-width="5" fill="none" opacity="0.8" />

      <!-- Secondary Vessel branches heading toward macula -->
      <path d="M 230 145 C 245 175, 260 195, 280 215" stroke="#991B1B" stroke-width="2.5" fill="none" opacity="0.75" />
      <path d="M 310 135 C 320 160, 330 185, 340 210" stroke="#B91C1C" stroke-width="2.2" fill="none" opacity="0.75" />
      <path d="M 240 355 C 255 325, 265 305, 285 285" stroke="#991B1B" stroke-width="2.5" fill="none" opacity="0.75" />
      <path d="M 320 365 C 330 335, 340 310, 345 285" stroke="#B91C1C" stroke-width="2" fill="none" opacity="0.75" />

      <!-- Macula / Fovea centralis (Temporal to disc, center at x=280, y=250) -->
      <ellipse cx="280" cy="250" rx="38" ry="38" fill="url(#foveaGrad)" />
      <circle cx="280" cy="250" r="7" fill="#2E0804" opacity="0.9" />
      <!-- Foveal light reflex -->
      <circle cx="279" cy="249" r="1.5" fill="#FEF08A" opacity="0.7" />

      <!-- Pathological Lesions based on grade -->
      ${lesionsSvg}

      <!-- Outer Shadow Vignette ring -->
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 8}" stroke="#000000" stroke-width="16" fill="none" opacity="0.4" />
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}
