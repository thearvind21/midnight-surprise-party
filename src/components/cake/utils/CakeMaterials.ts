
import * as THREE from "three";

export const createFrostingMaterial = (color: number = 0xb6e2a1) => {
  return new THREE.MeshPhongMaterial({ 
    color: color, 
    shininess: 20, 
    specular: 0xffffff,
    emissive: 0x447744,
    emissiveIntensity: 0.05
  });
};

export const createGlazeMaterial = (color: number = 0xc6f58c) => {
  return new THREE.MeshPhysicalMaterial({ 
    color: color, 
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.2,
    transmission: 0.5,
    thickness: 0.5
  });
};

export const createSucculentMaterial = (baseColor: number = 0x8fd19e, variation: number = 0) => {
  const hueVariation = Math.random() * 0.1 - 0.05;
  const adjustedColor = new THREE.Color(baseColor);
  adjustedColor.offsetHSL(hueVariation, 0.1, Math.random() * 0.2 - 0.1);
  
  return new THREE.MeshPhysicalMaterial({ 
    color: adjustedColor, 
    roughness: 0.8,
    clearcoat: 0.2,
    clearcoatRoughness: 0.4
  });
};

export const createFlameMaterial = () => {
  return new THREE.MeshPhongMaterial({ 
    color: 0xffe066, 
    emissive: 0xffc300, 
    emissiveIntensity: 0.7,
    transparent: true,
    opacity: 0.9
  });
};

export const createPetalMaterial = (progress: number = 0) => {
  const color = new THREE.Color().lerpColors(
    new THREE.Color(0xffb347),
    new THREE.Color(0xff6f61),
    progress
  );
  
  return new THREE.MeshPhysicalMaterial({ 
    color, 
    roughness: 0.6,
    clearcoat: 0.3,
    clearcoatRoughness: 0.3
  });
};

export const createBoardMaterial = () => {
  return new THREE.MeshPhongMaterial({
    color: 0xf7c6e0,
    shininess: 100,
    specular: 0xfbeee6,
    emissive: 0xf7e6f7,
    emissiveIntensity: 0.08
  });
};
