
import * as THREE from "three";

export class CakeDecorations {
  // Add cake decorations
  static addCakeDecorations = (
    scene: THREE.Scene, 
    cakeTop: THREE.Mesh,
    cakeMiddle: THREE.Mesh,
    cakeBase: THREE.Mesh
  ) => {
    // Add icing
    const icingGeometry = new THREE.TorusGeometry(1.55, 0.15, 8, 24);
    const icingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const icing = new THREE.Mesh(icingGeometry, icingMaterial);
    icing.position.y = 2.55;
    icing.rotation.x = Math.PI / 2;
    scene.add(icing);
    
    // Add sprinkles to all layers
    this.addSprinkles(scene, cakeTop.position.y + 0.5, 1.5);
    this.addSprinkles(scene, cakeMiddle.position.y + 0.5, 2);
    this.addSprinkles(scene, cakeBase.position.y + 0.5, 2.5);
    
    // Add cherries on top
    this.addCherry(scene, 0, 2.6, 0);
    this.addCherry(scene, 0.8, 2.6, 0.3);
    this.addCherry(scene, -0.6, 2.6, -0.5);
    this.addCherry(scene, 0.5, 2.6, -0.7);
    
    // Add chocolate decorations
    this.addChocolateStick(scene, 0.8, 2.2, 0.8);
    this.addChocolateStick(scene, -0.7, 2.2, 0.7);
    this.addChocolateStick(scene, -0.8, 2.2, -0.6);
  };
  
  // Add sprinkles
  static addSprinkles = (scene: THREE.Scene, yPosition: number, radius: number) => {
    const count = 50;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const sprinkleRadius = Math.random() * (radius - 0.3) + 0.3;
      const x = Math.cos(angle) * sprinkleRadius;
      const z = Math.sin(angle) * sprinkleRadius;
      
      const colors = [0xff6b81, 0x4ecdc4, 0xffbe76, 0xa29bfe, 0xffeaa7];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const sprinkleGeometry = new THREE.BoxGeometry(0.1, 0.03, 0.03);
      const sprinkleMaterial = new THREE.MeshPhongMaterial({ color });
      const sprinkle = new THREE.Mesh(sprinkleGeometry, sprinkleMaterial);
      
      sprinkle.position.set(x, yPosition, z);
      sprinkle.rotation.set(
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        Math.random() * Math.PI
      );
      
      scene.add(sprinkle);
    }
  };
  
  // Add cherry
  static addCherry = (scene: THREE.Scene, x: number, y: number, z: number) => {
    const cherryGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const cherryMaterial = new THREE.MeshPhongMaterial({ color: 0xff0033 });
    const cherry = new THREE.Mesh(cherryGeometry, cherryMaterial);
    cherry.position.set(x, y, z);
    scene.add(cherry);
    
    // Add stem
    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x7d5a4f });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.set(x, y + 0.15, z);
    stem.rotation.x = Math.PI / 6;
    scene.add(stem);
  };
  
  // Add chocolate decoration
  static addChocolateStick = (scene: THREE.Scene, x: number, y: number, z: number) => {
    const stickGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.05);
    const stickMaterial = new THREE.MeshPhongMaterial({ color: 0x4a2c2a });
    const stick = new THREE.Mesh(stickGeometry, stickMaterial);
    stick.position.set(x, y + 0.2, z);
    stick.rotation.set(
      Math.random() * 0.4,
      Math.random() * Math.PI * 2,
      Math.random() * 0.4
    );
    scene.add(stick);
  };
}
