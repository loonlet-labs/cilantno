import * as THREE from "three";
import { Ingredient } from "./Ingredient.ts";
import type { IngredientType } from "../../types.ts";

export class Lettuce extends Ingredient {
  type: IngredientType = "lettuce";

  constructor() {
    super();

    const shape = new THREE.Shape();
    // Wavy irregular lettuce shape
    const points = 12;
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const r = 0.35 + Math.sin(angle * 3) * 0.08 + Math.cos(angle * 5) * 0.05;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }

    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x7ec850,
      roughness: 0.7,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });

    const leaf = new THREE.Mesh(geo, mat);
    leaf.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    this.mesh.add(leaf);
  }
}
