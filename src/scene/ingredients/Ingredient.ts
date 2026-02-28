import * as THREE from "three";
import type { IngredientType } from "../../types.ts";

export abstract class Ingredient {
  abstract type: IngredientType;
  mesh: THREE.Group;
  picked = false;
  isHidden = false;
  isCover = false;
  protected hitArea: THREE.Mesh | null = null;
  private shiftTween: { target: THREE.Vector3; progress: number } | null = null;

  constructor() {
    this.mesh = new THREE.Group();
  }

  place(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
    this.mesh.rotation.y = Math.random() * Math.PI * 2;
  }

  setHidden(hidden: boolean) {
    this.isHidden = hidden;
    this.mesh.visible = !hidden;
  }

  setHighlight(on: boolean) {
    this.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.emissive.setHex(on ? 0x333333 : 0x000000);
      }
    });
  }

  getRaycastTargets(): THREE.Object3D[] {
    // If there's a dedicated hit area, use only that for raycasting.
    // This prevents invisible hit areas from competing with visible meshes
    // of other ingredients, and prevents tiny visual meshes from being
    // unhittable when clutter is nearby.
    if (this.hitArea) return [this.hitArea];

    const meshes: THREE.Object3D[] = [];
    this.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) meshes.push(child);
    });
    return meshes;
  }

  animatePick(onComplete: () => void) {
    this.picked = true;
    const startY = this.mesh.position.y;
    const startScale = this.mesh.scale.x;
    let t = 0;
    const animate = () => {
      t += 0.03;
      if (t >= 1) {
        this.mesh.visible = false;
        onComplete();
        return;
      }
      this.mesh.position.y = startY + t * 2;
      const s = startScale * (1 - t * 0.5);
      this.mesh.scale.set(s, s, s);
      this.mesh.rotation.z += 0.1;
      this.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.opacity = 1 - t;
          child.material.transparent = true;
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
  }

  animateWrongPick() {
    const originalX = this.mesh.position.x;
    let t = 0;
    const shake = () => {
      t += 0.1;
      if (t >= 1) {
        this.mesh.position.x = originalX;
        this.mesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive.setHex(0x000000);
          }
        });
        return;
      }
      this.mesh.position.x = originalX + Math.sin(t * Math.PI * 6) * 0.08;
      this.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.emissive.setHex(0x660000);
        }
      });
      requestAnimationFrame(shake);
    };
    shake();
  }

  animateShift(target: THREE.Vector3) {
    this.shiftTween = { target, progress: 0 };
  }

  update(_dt: number) {
    if (this.shiftTween) {
      this.shiftTween.progress += 0.05;
      if (this.shiftTween.progress >= 1) {
        this.mesh.position.copy(this.shiftTween.target);
        this.shiftTween = null;
      } else {
        this.mesh.position.lerp(this.shiftTween.target, 0.1);
      }
    }
  }

  dispose() {
    this.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}
