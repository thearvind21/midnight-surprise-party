import * as THREE from "three";

export const cutCakeAnimationImpl = (
  leftSlice: THREE.Group,
  rightSlice: THREE.Group,
  onAnimationComplete: () => void,
  onHalfway: () => void
) => {
  if (!leftSlice || !rightSlice) return;
  
  // Animate the slices moving apart
  const duration = 2.0;
  const startTime = Date.now();
  const initialLeftX = leftSlice.position.x;
  const initialRightX = rightSlice.position.x;
  const targetOffset = 1.5; // How far apart the slices should move
  
  const animateCut = () => {
    if (!leftSlice || !rightSlice) return;
    
    const elapsed = (Date.now() - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    
    leftSlice.position.x = initialLeftX - (targetOffset * easedProgress);
    rightSlice.position.x = initialRightX + (targetOffset * easedProgress);
    
    if (progress < 1) {
      requestAnimationFrame(animateCut);
      
      // Call halfway callback when we reach 50% of the animation
      if (progress >= 0.5 && elapsed - (startTime / 1000) < 0.1) {
        onHalfway();
      }
    } else {
      // When animation completes, call the completion callback
      onAnimationComplete();
    }
  };
  
  animateCut();
};

export const animateFlames = (flameRefs: THREE.Mesh[], time: number) => {
  flameRefs.forEach((flame, idx) => {
    const scale = 1 + Math.sin(time * 8 + idx) * 0.15 + Math.random() * 0.07;
    flame.scale.y = scale;
    if (flame.material instanceof THREE.MeshPhongMaterial) {
      flame.material.emissiveIntensity = 0.7 + Math.sin(time * 10 + idx) * 0.3 + Math.random() * 0.1;
    }
  });
};

export const animateParticles = (particleSystem: THREE.Points, time: number) => {
  particleSystem.rotation.y += 0.001;
  
  // Pulse the sparkles
  const positions = particleSystem.geometry.attributes.position.array;
  const sizes = particleSystem.geometry.attributes.size.array;
  const count = positions.length / 3;
  
  for (let i = 0; i < count; i++) {
    const pulseFactor = Math.sin((time + i * 0.1) * 2) * 0.5 + 1;
    sizes[i] = (Math.random() * 2 + 1) * pulseFactor;
  }
  particleSystem.geometry.attributes.size.needsUpdate = true;
};

export const animateRevealScaling = (
  revealStep: number,
  baseGroup: THREE.Group,
  tier1Group: THREE.Group,
  tier2Group: THREE.Group,
  tier3Group: THREE.Group,
  decoGroup: THREE.Group,
  cakeGroup: THREE.Group
) => {
  const targetScale = new THREE.Vector3(1, 1, 1);
  const lerpFactor = 0.1; // Slower, smoother animation

  if (revealStep >= 1) {
    baseGroup.scale.lerp(targetScale, lerpFactor);
  }
  if (revealStep >= 2) {
    tier1Group.scale.lerp(targetScale, lerpFactor);
  }
  if (revealStep >= 3) {
    tier2Group.scale.lerp(targetScale, lerpFactor);
  }
  if (revealStep >= 4) {
    tier3Group.scale.lerp(targetScale, lerpFactor);
  }
  if (revealStep >= 5) {
    decoGroup.scale.lerp(targetScale, lerpFactor);
    
    // Create and manage glow mesh if not already created
    let glowMesh = cakeGroup.children.find(child => 
      child instanceof THREE.Mesh && 
      child.material instanceof THREE.MeshBasicMaterial &&
      child.material.transparent
    ) as THREE.Mesh | undefined;
    
    if (!glowMesh) {
      const glowGeo = new THREE.SphereGeometry(2.2, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0 
      });
      glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.position.y = 1.1;
      cakeGroup.add(glowMesh);
    }
    
    // Fade in glow
    if (glowMesh.material instanceof THREE.MeshBasicMaterial) {
      glowMesh.material.opacity = Math.min(0.18, glowMesh.material.opacity + 0.01);
    }
  } else {
    // Remove glow when not in final step
    const glowMesh = cakeGroup.children.find(child => 
      child instanceof THREE.Mesh && 
      child.material instanceof THREE.MeshBasicMaterial &&
      child.material.transparent
    );
    
    if (glowMesh) {
      cakeGroup.remove(glowMesh);
    }
  }
};
