import * as THREE from "three";
import { Ingredient } from "./Ingredient.ts";
import type { IngredientType } from "../../types.ts";

export class Cucumber extends Ingredient {
  type: IngredientType = "cucumber";

  constructor() {
    super();

    // Outer green ring
    const outerGeo = new THREE.CircleGeometry(0.2, 16);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x4a7c3f,
      roughness: 0.5,
    });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    outer.rotation.x = -Math.PI / 2;
    outer.position.y = 0.01;
    outer.castShadow = true;
    this.mesh.add(outer);

    // Inner lighter center
    const innerGeo = new THREE.CircleGeometry(0.14, 16);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x9cd88f,
      roughness: 0.5,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.rotation.x = -Math.PI / 2;
    inner.position.y = 0.015;
    this.mesh.add(inner);

    // Seeds (small dots)
    const seedGeo = new THREE.CircleGeometry(0.015, 6);
    const seedMat = new THREE.MeshStandardMaterial({ color: 0xd4e8c0 });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const seed = new THREE.Mesh(seedGeo, seedMat);
      seed.rotation.x = -Math.PI / 2;
      seed.position.set(Math.cos(angle) * 0.08, 0.02, Math.sin(angle) * 0.08);
      this.mesh.add(seed);
    }
  }
}
