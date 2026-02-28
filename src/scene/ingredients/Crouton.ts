import * as THREE from "three";
import { Ingredient } from "./Ingredient.ts";
import type { IngredientType } from "../../types.ts";

export class Crouton extends Ingredient {
  type: IngredientType = "crouton";

  constructor() {
    super();

    const geo = new THREE.BoxGeometry(0.25, 0.15, 0.25);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xd4a650,
      roughness: 0.8,
      metalness: 0.0,
    });
    const crouton = new THREE.Mesh(geo, mat);
    crouton.position.y = 0.08;
    crouton.rotation.set(
      (Math.random() - 0.5) * 0.3,
      Math.random() * Math.PI,
      (Math.random() - 0.5) * 0.3
    );
    crouton.castShadow = true;
    this.mesh.add(crouton);
  }
}
