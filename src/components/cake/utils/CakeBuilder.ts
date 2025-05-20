
import * as THREE from "three";
import { createFrostingMaterial, createGlazeMaterial, createBoardMaterial } from "./CakeMaterials";

// Helper to determine which slice group to use based on position
export const getTargetGroup = (angle: number, leftSlice: THREE.Group, rightSlice: THREE.Group) => {
  // If angle is in the left half of the cake
  if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
    return leftSlice;
  } else {
    return rightSlice;
  }
};

export const createCakeBoard = (baseGroup: THREE.Group) => {
  const boardGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.22, 64);
  const boardMat = createBoardMaterial();
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.y = -1.13;
  board.receiveShadow = true;
  baseGroup.add(board);
  return board;
};

export const createCakeTier = (
  tier: { r: number, h: number, y: number }, 
  group: THREE.Group, 
  isLeft: boolean,
  color: number = 0xb6e2a1,
  glazeColor: number = 0xc6f58c
) => {
  const geo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 64);
  const mat = createFrostingMaterial(color);
  
  let mesh;
  if (isLeft) {
    // Create left half of the cake tier
    const halfGeo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 32, 1, false, 0, Math.PI);
    mesh = new THREE.Mesh(halfGeo, mat);
    mesh.rotation.y = Math.PI;
  } else {
    // Create right half of the cake tier
    const halfGeo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 32, 1, false, 0, Math.PI);
    mesh = new THREE.Mesh(halfGeo, mat);
  }
  
  mesh.position.y = tier.y;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  
  // Add glazing and drips
  addGlazing(tier, group, isLeft, glazeColor);
  
  return mesh;
};

const addGlazing = (
  tier: { r: number, h: number, y: number }, 
  group: THREE.Group, 
  isLeft: boolean,
  glazeColor: number = 0xc6f58c
) => {
  // Glaze with glass-like material
  const dripGeo = new THREE.TorusGeometry(tier.r + 0.05, 0.08, 16, 32, Math.PI);
  const dripMat = createGlazeMaterial(glazeColor);
  const drip = new THREE.Mesh(dripGeo, dripMat);
  drip.position.y = tier.y + tier.h / 2 - 0.05;
  drip.rotation.y = isLeft ? Math.PI : 0;
  drip.rotation.x = Math.PI / 2;
  group.add(drip);
  
  // Random glaze drips
  const startAngle = isLeft ? 0 : Math.PI;
  const endAngle = isLeft ? Math.PI : Math.PI * 2;
  
  for (let d = 0; d < 6; d++) {
    const angle = startAngle + ((endAngle - startAngle) * (d / 6)) + (Math.random() * 0.2);
    const dripLen = 0.18 + Math.random() * 0.18;
    const dripGeo = new THREE.SphereGeometry(0.07 + Math.random() * 0.04, 10, 10);
    const dripMat = createGlazeMaterial(glazeColor);
    const dripDrop = new THREE.Mesh(dripGeo, dripMat);
    dripDrop.position.set(
      Math.cos(angle) * (tier.r + 0.07),
      tier.y + tier.h / 2 - dripLen,
      Math.sin(angle) * (tier.r + 0.07)
    );
    group.add(dripDrop);
  }
};
