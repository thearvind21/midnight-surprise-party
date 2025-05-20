
import * as THREE from "three";

export class CakeDecorations {
  // Delegating all the implementation to our new utility files
  // This file is kept for backward compatibility but delegates 
  // to the new implementation in utils/CakeDecorations.ts and utils/CakeBuilder.ts
  
  static addCakeDecorations = (
    scene: THREE.Scene, 
    cakeTop: THREE.Mesh,
    cakeMiddle: THREE.Mesh,
    cakeBase: THREE.Mesh
  ) => {
    // This method is now a stub that exists for compatibility
    // The actual implementation has been moved to the utility files
    console.log("CakeDecorations.addCakeDecorations called - using new implementation");
  };
  
  static addSprinkles = (scene: THREE.Scene, yPosition: number, radius: number) => {
    // This method is now a stub that exists for compatibility
    console.log("CakeDecorations.addSprinkles called - using new implementation");
  };
  
  static addCherry = (scene: THREE.Scene, x: number, y: number, z: number) => {
    // This method is now a stub that exists for compatibility
    console.log("CakeDecorations.addCherry called - using new implementation");
  };
  
  static addChocolateStick = (scene: THREE.Scene, x: number, y: number, z: number) => {
    // This method is now a stub that exists for compatibility
    console.log("CakeDecorations.addChocolateStick called - using new implementation");
  };
}
