import * as THREE from "three";
import { Ingredient } from "./Ingredient.ts";
import type { IngredientType } from "../../types.ts";

export class Parsley extends Ingredient {
  type: IngredientType = "parsley";

  constructor(scale: number = 1.0) {
    super();

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2e8b2e,  // Very similar to cilantro but slightly different
      roughness: 0.5,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // Parsley: pointed, serrated lobes (vs cilantro's rounded)
    for (let i = 0; i < 3; i++) {
      const shape = new THREE.Shape();
      const angle = (i * Math.PI * 2) / 3;

      shape.moveTo(0, 0);

      // More pointed, jagged edges
      const tipX = Math.cos(angle) * 0.38;
      const tipZ = Math.sin(angle) * 0.38;
      const perpX = -Math.sin(angle);
      const perpZ = Math.cos(angle);

      // Jagged left edge
      shape.lineTo(
        Math.cos(angle) * 0.15 + perpX * 0.1,
        Math.sin(angle) * 0.15 + perpZ * 0.1
      );
      shape.lineTo(
        Math.cos(angle) * 0.22 + perpX * 0.05,
        Math.sin(angle) * 0.22 + perpZ * 0.05
      );
      shape.lineTo(tipX, tipZ);
      // Jagged right edge
      shape.lineTo(
        Math.cos(angle) * 0.22 - perpX * 0.05,
        Math.sin(angle) * 0.22 - perpZ * 0.05
      );
      shape.lineTo(
        Math.cos(angle) * 0.15 - perpX * 0.1,
        Math.sin(angle) * 0.15 - perpZ * 0.1
      );
      shape.lineTo(0, 0);

      const geo = new THREE.ShapeGeometry(shape);
      const lobe = new THREE.Mesh(geo, leafMat);
      lobe.rotation.x = -Math.PI / 2;
      lobe.position.y = 0.01;
      lobe.castShadow = true;
      this.mesh.add(lobe);
    }

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.012, 0.018, 0.25, 6);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3d8a3d, roughness: 0.7 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, -0.08, 0);
    stem.rotation.z = -0.2;
    this.mesh.add(stem);

    this.mesh.scale.setScalar(scale);
  }
}
