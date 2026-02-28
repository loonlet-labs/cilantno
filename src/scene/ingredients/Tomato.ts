import * as THREE from "three";
import { Ingredient } from "./Ingredient.ts";
import type { IngredientType } from "../../types.ts";

export class Tomato extends Ingredient {
  type: IngredientType = "tomato";

  constructor() {
    super();

    // Half-sphere tomato slice
    const geo = new THREE.SphereGeometry(0.22, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xe63946,
      roughness: 0.4,
      metalness: 0.05,
    });
    const tomato = new THREE.Mesh(geo, mat);
    tomato.rotation.x = Math.PI;
    tomato.position.y = 0.02;
    tomato.castShadow = true;
    this.mesh.add(tomato);

    // Flat bottom
    const discGeo = new THREE.CircleGeometry(0.22, 16);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0xff7b7b,
      roughness: 0.5,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.02;
    this.mesh.add(disc);
  }
}
