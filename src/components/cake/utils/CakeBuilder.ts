import * as THREE from "three";
import { createFrostingMaterial, createGlazeMaterial, createBoardMaterial } from "./CakeMaterials";

// Helper to determine which slice group to use based on position
// export const getTargetGroup = (angle: number, leftSlice: THREE.Group, rightSlice: THREE.Group) => {
//   // If angle is in the left half of the cake
//   if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
//     return leftSlice;
//   } else {
//     return rightSlice;
//   }
// };

export const createCakeBoard = (baseGroup: THREE.Group, theme: string = 'default') => {
  const boardGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.22, 64);
  const boardMat = createBoardMaterial(theme);
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.y = -1.13;
  board.receiveShadow = true;
  baseGroup.add(board);
  
  // For cutting animation, create left and right halves of the board
  // const boardLeft = new THREE.Mesh(boardGeo, boardMat);
  // boardLeft.position.y = -1.13;
  // boardLeft.receiveShadow = true;
  // // Note: Precise splitting geometry for cutting is more complex,
  // // for simplicity, we'll use references and animate position.

  // const boardRight = new THREE.Mesh(boardGeo, boardMat);
  // boardRight.position.y = -1.13;
  // boardRight.receiveShadow = true;

  // Return the main board mesh and slice references for potential cutting animation
  // return { mainMesh: board, leftSlice: boardLeft, rightSlice: boardRight };
};

export const createCakeTier = (
  tier: { r: number, h: number, y: number }, 
  targetGroup: THREE.Group, // Added targetGroup parameter
  theme: string = 'default'
) => {
  const geo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 64);
  const mat = createFrostingMaterial(theme);
  
  // Create left and right halves for cutting animation - temporarily commented out
  // const halfGeo = new THREE.CylinderGeometry(tier.r, tier.r, tier.h, 32, 1, false, 0, Math.PI);

  const mesh = new THREE.Mesh(geo, mat); // Use full geometry for reveal
  mesh.position.y = tier.y;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  targetGroup.add(mesh); // Add to the target group

  // const meshLeft = new THREE.Mesh(halfGeo, mat);
  // meshLeft.rotation.y = Math.PI;
  // meshLeft.position.y = tier.y;
  // meshLeft.castShadow = true;
  // meshLeft.receiveShadow = true;

  // const meshRight = new THREE.Mesh(halfGeo, mat);
  // meshRight.position.y = tier.y;
  // meshRight.castShadow = true;
  // meshRight.receiveShadow = true;
  
  // Add glazing and drips to the halves - refactor to add to the single group
  addGlazing(tier, targetGroup, theme); // Updated call to addGlazing

  // Return the left and right slice meshes - not needed for reveal focus
  // return { leftSlice: meshLeft, rightSlice: meshRight };
};

const addGlazing = (
  tier: { r: number, h: number, y: number }, 
  targetGroup: THREE.Group, // Updated to take a single target group
  theme: string = 'default'
) => {
  // Glaze with glass-like material
  const dripGeo = new THREE.TorusGeometry(tier.r + 0.05, 0.08, 16, 32, Math.PI * 2); // Use full torus for reveal
  const dripMat = createGlazeMaterial(theme);
  const drip = new THREE.Mesh(dripGeo, dripMat);
  drip.position.y = tier.y + tier.h / 2 - 0.05;
  // drip.rotation.y = isLeft ? Math.PI : 0; // Removed slicing logic
  drip.rotation.x = Math.PI / 2;
  targetGroup.add(drip); // Add to the target group
  
  // Random glaze drips
  const startAngle = 0; // Start from 0 for the full circle
  const endAngle = Math.PI * 2;
  
  for (let d = 0; d < 12; d++) { // Increased number of drips for the full circle
    const angle = startAngle + ((endAngle - startAngle) * (d / 12)) + (Math.random() * 0.2);
    const dripLen = 0.18 + Math.random() * 0.18;
    const dripGeo = new THREE.SphereGeometry(0.07 + Math.random() * 0.04, 10, 10);
    const dripMat = createGlazeMaterial(theme);
    const dripDrop = new THREE.Mesh(dripGeo, dripMat);
    dripDrop.position.set(
      Math.cos(angle) * (tier.r + 0.07),
      tier.y + tier.h / 2 - dripLen,
      Math.sin(angle) * (tier.r + 0.07)
    );
    targetGroup.add(dripDrop); // Add to the target group
  }
};

// Note: Decorations also need to be modified to create and return slice groups similar to createCakeTier
// ... (rest of the file needs similar refactoring for decorations)
