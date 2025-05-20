import * as THREE from "three";
import { createSucculentMaterial, createFlameMaterial, createPetalMaterial, getPebbleColor } from "./CakeMaterials";
// import { getTargetGroup } from "./CakeBuilder"; // Comment out getTargetGroup import

export const createSucculent = (
  x: number, 
  y: number, 
  z: number, 
  scale: number = 1, 
  theme: string = 'default',
  tall: boolean = false, 
  targetGroup: THREE.Group
) => {
  const group = new THREE.Group();
  
  // Create realistic looking leaves with better materials
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const sx = Math.cos(angle) * 0.18 * scale;
    const sz = Math.sin(angle) * 0.18 * scale;
    
    // Use more detailed geometry for leaves
    const leafGeo = new THREE.SphereGeometry(0.13 * scale, 12, 12);
    const leafMat = createSucculentMaterial(theme, i);
    
    const mesh = new THREE.Mesh(leafGeo, leafMat);
    mesh.position.set(sx, 0, sz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  
  // Center part of the succulent
  const centerGeo = new THREE.SphereGeometry(0.12 * scale, 12, 12);
  const centerMat = createSucculentMaterial(theme);
  
  const center = new THREE.Mesh(centerGeo, centerMat);
  center.castShadow = true;
  center.receiveShadow = true;
  group.add(center);
  
  // Add tall leaves for certain succulents
  if (tall) {
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.2;
      const leafGeo = new THREE.ConeGeometry(0.07 * scale, 0.5 * scale + Math.random() * 0.2, 8);
      
      // Enhanced leaf material
      const leafColor = new THREE.Color(createSucculentMaterial(theme).color);
      leafColor.offsetHSL(Math.random() * 0.1 - 0.05, 0, Math.random() * 0.1);
      
      const leafMat = new THREE.MeshPhysicalMaterial({ 
        color: leafColor, 
        roughness: 0.7,
        clearcoat: 0.2
      });
      
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(
        Math.cos(angle) * 0.13 * scale, 
        0.25 * scale, 
        Math.sin(angle) * 0.13 * scale
      );
      leaf.rotation.x = Math.PI / 2 + Math.random() * 0.3;
      leaf.rotation.z = angle;
      leaf.castShadow = true;
      group.add(leaf);
    }
  }
  
  group.position.set(x, y, z);
  targetGroup.add(group);
  
  return group;
};

export const addSucculentsAroundCake = (targetGroup: THREE.Group, theme: string = 'default') => {
  // Add succulents around the cake
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    createSucculent(
      Math.cos(angle) * 1.7, 
      -0.2, 
      Math.sin(angle) * 1.7, 
      1, 
      theme,
      i % 3 === 0, 
      targetGroup
    );
    
    if (i % 2 === 0) {
      createSucculent(
        Math.cos(angle) * 1.1, 
        0.6, 
        Math.sin(angle) * 1.1, 
        0.7, 
        theme,
        i % 4 === 0, 
        targetGroup
      );
    }
    
    if (i % 3 === 0) {
      createSucculent(
        Math.cos(angle) * 0.6, 
        1.3, 
        Math.sin(angle) * 0.6, 
        0.5, 
        theme,
        i % 5 === 0, 
        targetGroup
      );
    }
  }
};

export const addPebbles = (targetGroup: THREE.Group, theme: string = 'default') => {
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const pebbleGeo = new THREE.SphereGeometry(0.09 + Math.random() * 0.05, 8, 8);
    const pebbleMat = new THREE.MeshPhongMaterial({ 
      color: getPebbleColor(theme),
      shininess: 30 
    });
    const pebble = new THREE.Mesh(pebbleGeo, pebbleMat);
    pebble.position.set(
      Math.cos(angle) * 2.7, 
      -1.0 + Math.random() * 0.05, 
      Math.sin(angle) * 2.7
    );
    targetGroup.add(pebble);
  }
};

export const addCandles = (targetGroup: THREE.Group, theme: string = 'default'): THREE.Mesh[] => {
  const flames: THREE.Mesh[] = [];
  
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    
    const candleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8);
    const candleMat = new THREE.MeshPhysicalMaterial({ 
      color: (themes as any)[theme]?.candle || themes.default.candle,
      roughness: 0.2,
      clearcoat: 0.8
    });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.set(
      Math.cos(angle) * 0.35, 
      1.45, 
      Math.sin(angle) * 0.35
    );
    candle.castShadow = true;
    targetGroup.add(candle);
    
    // Create improved flame with glowing material
    const flameGeo = new THREE.ConeGeometry(0.06, 0.13, 8);
    const flameMat = createFlameMaterial(theme);
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0, 0.22, 0);
    candle.add(flame);
    flames.push(flame);
  }
  
  return flames;
};

export const createFlower = (targetGroup: THREE.Group, theme: string = 'default') => {
  // Create prettier petals with more realistic materials
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    
    // Create color gradient for petals
    const progress = i / 12;
    const petalGeo = new THREE.ConeGeometry(0.11, 0.36, 16);
    const petalMat = createPetalMaterial(progress, theme);
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.position.set(
      Math.cos(angle) * 0.19, 
      1.62, 
      Math.sin(angle) * 0.19
    );
    petal.rotation.x = Math.PI / 2 + 0.2;
    petal.rotation.z = angle;
    petal.castShadow = true;
    
    // Determine which half of the cake this petal belongs to
    targetGroup.add(petal);
  }
  
  // Inner petals
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const petalGeo = new THREE.ConeGeometry(0.08, 0.22, 12);
    const petalMat = new THREE.MeshPhysicalMaterial({ 
      color: (themes as any)[theme]?.flowerPetalInner || themes.default.flowerPetalInner,
      roughness: 0.6,
      clearcoat: 0.2
    });
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.position.set(
      Math.cos(angle) * 0.11, 
      1.58, 
      Math.sin(angle) * 0.11
    );
    petal.rotation.x = Math.PI / 2 + 0.2;
    petal.rotation.z = angle;
    petal.castShadow = true;
    
    // Determine which half of the cake this petal belongs to
    targetGroup.add(petal);
  }
  
  // Flower center - create two half-spheres
  const flowerCenterGeo = new THREE.SphereGeometry(0.09, 14, 14);
  const flowerCenterMat = new THREE.MeshPhysicalMaterial({ 
    color: (themes as any)[theme]?.flowerCenter || themes.default.flowerCenter,
    roughness: 0.3,
    clearcoat: 0.5
  });
  
  // Create left half sphere
  // const centerLeft = new THREE.Mesh(flowerCenterGeo, flowerCenterMat);
  // centerLeft.position.set(-0.01, 1.68, 0);
  // centerLeft.castShadow = true;
  // leftSlice.add(centerLeft);
  
  // Create right half sphere
  // const centerRight = new THREE.Mesh(flowerCenterGeo, flowerCenterMat);
  // centerRight.position.set(0.01, 1.68, 0);
  // centerRight.castShadow = true;
  // rightSlice.add(centerRight);

  // Add a single flower center to the target group
  const flowerCenterMesh = new THREE.Mesh(flowerCenterGeo, flowerCenterMat);
  flowerCenterMesh.position.set(0, 1.68, 0); // Center the sphere
  flowerCenterMesh.castShadow = true;
  targetGroup.add(flowerCenterMesh); // Add to the target group
};

// Add themes object for use within this file
const themes = {
  default: { candle: 0xffffff, flowerPetalInner: 0xffb347, flowerCenter: 0xffe066 },
  pastel: { candle: 0xffffff, flowerPetalInner: 0xffe066, flowerCenter: 0xffccee },
  vibrant: { candle: 0xffffff, flowerPetalInner: 0xffff00, flowerCenter: 0xff1493 },
  night: { candle: 0xcccccc, flowerPetalInner: 0x4682b4, flowerCenter: 0x00bfff },
};
