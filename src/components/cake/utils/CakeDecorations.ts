
import * as THREE from "three";
import { createSucculentMaterial, createFlameMaterial, createPetalMaterial } from "./CakeMaterials";
import { getTargetGroup } from "./CakeBuilder";

export const createSucculent = (
  x: number, 
  y: number, 
  z: number, 
  scale: number = 1, 
  color: number = 0x8fd19e, 
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
    const leafMat = createSucculentMaterial(color, i);
    
    const mesh = new THREE.Mesh(leafGeo, leafMat);
    mesh.position.set(sx, 0, sz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  
  // Center part of the succulent
  const centerGeo = new THREE.SphereGeometry(0.12 * scale, 12, 12);
  const centerMat = createSucculentMaterial(0xb6e2a1);
  
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
      const leafColor = new THREE.Color(0x7fc97f);
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

export const addSucculentsAroundCake = (leftSlice: THREE.Group, rightSlice: THREE.Group) => {
  // Add succulents around the cake
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const targetGroup = getTargetGroup(angle, leftSlice, rightSlice);
    createSucculent(
      Math.cos(angle) * 1.7, 
      -0.2, 
      Math.sin(angle) * 1.7, 
      1, 
      0x8fd19e, 
      i % 3 === 0, 
      targetGroup
    );
    
    if (i % 2 === 0) {
      createSucculent(
        Math.cos(angle) * 1.1, 
        0.6, 
        Math.sin(angle) * 1.1, 
        0.7, 
        0x9e8fd1, 
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
        0xd1a98f, 
        i % 5 === 0, 
        targetGroup
      );
    }
  }
};

export const addPebbles = (leftSlice: THREE.Group, rightSlice: THREE.Group) => {
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const pebbleGeo = new THREE.SphereGeometry(0.09 + Math.random() * 0.05, 8, 8);
    const pebbleMat = new THREE.MeshPhongMaterial({ 
      color: 0xcfcfcf + Math.floor(Math.random() * 0x30), 
      shininess: 30 
    });
    const pebble = new THREE.Mesh(pebbleGeo, pebbleMat);
    pebble.position.set(
      Math.cos(angle) * 2.7, 
      -1.0 + Math.random() * 0.05, 
      Math.sin(angle) * 2.7
    );
    const targetGroup = getTargetGroup(angle, leftSlice, rightSlice);
    targetGroup.add(pebble);
  }
};

export const addCandles = (leftSlice: THREE.Group, rightSlice: THREE.Group): THREE.Mesh[] => {
  const flames: THREE.Mesh[] = [];
  
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const targetGroup = getTargetGroup(angle, leftSlice, rightSlice);
    
    const candleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 8);
    const candleMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xffffff, 
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
    const flameMat = createFlameMaterial();
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0, 0.22, 0);
    candle.add(flame);
    flames.push(flame);
  }
  
  return flames;
};

export const createFlower = (leftSlice: THREE.Group, rightSlice: THREE.Group) => {
  // Create prettier petals with more realistic materials
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    
    // Create color gradient for petals
    const progress = i / 12;
    const petalGeo = new THREE.ConeGeometry(0.11, 0.36, 16);
    const petalMat = createPetalMaterial(progress);
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
    const targetGroup = getTargetGroup(angle, leftSlice, rightSlice);
    targetGroup.add(petal);
  }
  
  // Inner petals
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const petalGeo = new THREE.ConeGeometry(0.08, 0.22, 12);
    const petalMat = new THREE.MeshPhysicalMaterial({ 
      color: 0xffb347, 
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
    const targetGroup = getTargetGroup(angle, leftSlice, rightSlice);
    targetGroup.add(petal);
  }
  
  // Flower center - create two half-spheres
  const flowerCenterGeo = new THREE.SphereGeometry(0.09, 14, 14);
  const flowerCenterMat = new THREE.MeshPhysicalMaterial({ 
    color: 0xffe066, 
    roughness: 0.3,
    clearcoat: 0.5
  });
  
  // Create left half sphere
  const centerLeft = new THREE.Mesh(flowerCenterGeo, flowerCenterMat);
  centerLeft.position.set(-0.01, 1.68, 0);
  centerLeft.castShadow = true;
  leftSlice.add(centerLeft);
  
  // Create right half sphere
  const centerRight = new THREE.Mesh(flowerCenterGeo, flowerCenterMat);
  centerRight.position.set(0.01, 1.68, 0);
  centerRight.castShadow = true;
  rightSlice.add(centerRight);
};
