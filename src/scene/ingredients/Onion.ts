import * as THREE from "three";
import { Ingredient } from "./Ingredient.ts";
import type { IngredientType } from "../../types.ts";

export class Onion extends Ingredient {
  type: IngredientType = "onion";

  constructor() {
    super();

    // Onion ring — torus
    const geo = new THREE.TorusGeometry(0.18, 0.04, 8, 24);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xd8b4e8,
      roughness: 0.4,
      metalness: 0.05,
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    ring.castShadow = true;
    this.mesh.add(ring);
  }
}
