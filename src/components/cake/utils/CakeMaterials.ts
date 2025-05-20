import * as THREE from "three";

// Define theme color palettes
const themes = {
  default: {
    frosting: 0xb6e2a1, // Pastel Green
    glaze: 0xc6f58c,     // Glaze Green
    succulentBase: 0x8fd19e, // Greenish
    succulentCenter: 0xb6e2a1, // Lighter Green
    succulentTall: 0x7fc97f,   // Darker Green
    pebble: { min: 0xcfcfcf, max: 0x303030 }, // Grayish
    candle: 0xffffff,    // White
    flame: { start: 0xffb347, end: 0xff6f61 }, // Orange to Red gradient
    flowerPetalInner: 0xffb347, // Orange
    flowerCenter: 0xffe066,  // Yellow
    board: 0xf7c6e0,     // Pinkish
  },
  pastel: {
    frosting: 0xffe5e5, // Pastel Pink
    glaze: 0xffc0cb,     // Pink
    succulentBase: 0xb3e0ff, // Light Blue
    succulentCenter: 0xcceeff, // Lighter Blue
    succulentTall: 0x80c0ff,   // Medium Blue
    pebble: { min: 0xe0ccee, max: 0x202020 }, // Purplish Gray
    candle: 0xffffff,    // White
    flame: { start: 0xffe066, end: 0xffa07a }, // Yellow to Salmon gradient
    flowerPetalInner: 0xffe066, // Yellow
    flowerCenter: 0xffccee,  // Light Purple
    board: 0xe0ccee,     // Light Purple
  },
  vibrant: {
    frosting: 0xff4d4d, // Red
    glaze: 0xff8000,     // Orange
    succulentBase: 0x8a2be2, // Blue Violet
    succulentCenter: 0x9370db, // Medium Purple
    succulentTall: 0x4b0082,   // Indigo
    pebble: { min: 0x800080, max: 0x400040 }, // Purple
    candle: 0xffffff,    // White
    flame: { start: 0xffff00, end: 0xff4500 }, // Yellow to Orange Red gradient
    flowerPetalInner: 0xffff00, // Yellow
    flowerCenter: 0xff1493,  // Deep Pink
    board: 0xff69b4,     // Hot Pink
  },
  night: {
    frosting: 0x36454f, // Charcoal
    glaze: 0x5a7d7d,     // Dark Cyan
    succulentBase: 0x708090, // Slate Gray
    succulentCenter: 0xb0c4de, // Light Steel Blue
    succulentTall: 0x191970,   // Midnight Blue
    pebble: { min: 0x2f4f4f, max: 0x101010 }, // Dark Slate Gray
    candle: 0xcccccc,    // Light Gray
    flame: { start: 0x4682b4, end: 0x1e90ff }, // Steel Blue to Dodger Blue gradient
    flowerPetalInner: 0x4682b4, // Steel Blue
    flowerCenter: 0x00bfff,  // Deep Sky Blue
    board: 0x2f4f4f,     // Dark Slate Gray
  },
};

export const createFrostingMaterial = (theme: string = 'default') => {
  const color = (themes as any)[theme]?.frosting || themes.default.frosting;
  return new THREE.MeshPhongMaterial({ 
    color: color, 
    shininess: 20, 
    specular: 0xffffff,
    emissive: new THREE.Color(color).multiplyScalar(0.1), // Subtle self-illumination based on frosting color
    emissiveIntensity: 0.5 // Increased intensity for better visibility in low light
  });
};

export const createGlazeMaterial = (theme: string = 'default') => {
  const color = (themes as any)[theme]?.glaze || themes.default.glaze;
  return new THREE.MeshPhysicalMaterial({ 
    color: color, 
    roughness: 0.2,
    metalness: 0.05, // Reduced metalness
    clearcoat: 1.0,
    clearcoatRoughness: 0.2,
    transmission: 0.6, // Increased transmission for more glassiness
    thickness: 0.5,
    transparent: true, // Ensure transparency is enabled
    opacity: 0.8 // Slightly reduce opacity
  });
};

export const createSucculentMaterial = (theme: string = 'default', variation: number = 0) => {
  const baseColor = (themes as any)[theme]?.succulentBase || themes.default.succulentBase;
  const hueVariation = Math.random() * 0.1 - 0.05;
  const adjustedColor = new THREE.Color(baseColor);
  adjustedColor.offsetHSL(hueVariation, 0.1, Math.random() * 0.2 - 0.1);
  
  return new THREE.MeshPhysicalMaterial({ 
    color: adjustedColor, 
    roughness: 0.7, // Slightly increased roughness
    clearcoat: 0.1,
    clearcoatRoughness: 0.3
  });
};

export const createFlameMaterial = (theme: string = 'default') => {
  const startColor = (themes as any)[theme]?.flame.start || themes.default.flame.start;
  const endColor = (themes as any)[theme]?.flame.end || themes.default.flame.end;
  const color = new THREE.Color().lerpColors(new THREE.Color(startColor), new THREE.Color(endColor), 0.5); // Use average color for base material
  
  return new THREE.MeshPhongMaterial({ 
    color: color, // Base color
    emissive: new THREE.Color(startColor), // Emissive starts from the bright color
    emissiveIntensity: 0.8, // Increased intensity
    transparent: true,
    opacity: 0.9 // Slightly reduced opacity
  });
};

export const createPetalMaterial = (progress: number = 0, theme: string = 'default') => {
   const startColor = (themes as any)[theme]?.flame.start || themes.default.flame.start; // Reusing flame gradient for flower petals
   const endColor = (themes as any)[theme]?.flame.end || themes.default.flame.end;

  const color = new THREE.Color().lerpColors(
    new THREE.Color(startColor),
    new THREE.Color(endColor),
    progress
  );
  
  return new THREE.MeshPhysicalMaterial({ 
    color, 
    roughness: 0.5, // Slightly reduced roughness
    clearcoat: 0.4, // Slightly increased clearcoat
    clearcoatRoughness: 0.3
  });
};

export const createBoardMaterial = (theme: string = 'default') => {
  const color = (themes as any)[theme]?.board || themes.default.board;
  return new THREE.MeshPhongMaterial({
    color: color,
    shininess: 100,
    specular: 0xfbeee6,
    emissive: new THREE.Color(color).multiplyScalar(0.05), // Subtle self-illumination
    emissiveIntensity: 0.08
  });
};

export const getPebbleColor = (theme: string = 'default') => {
  const pebbleColors = (themes as any)[theme]?.pebble || themes.default.pebble;
   // Linear interpolation between min and max colors
   const color = new THREE.Color().lerpColors(
    new THREE.Color(pebbleColors.min),
    new THREE.Color(pebbleColors.max),
    Math.random()
  );
  return color;
};
