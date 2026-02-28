import * as THREE from "three";
import { Ingredient } from "./Ingredient.ts";
import type { IngredientType } from "../../types.ts";

export class Cilantro extends Ingredient {
  type: IngredientType = "cilantro";

  constructor(scale: number = 1.0) {
    super();

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2d8c2d,
      roughness: 0.6,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // Create tri-lobed cilantro leaf shape
    for (let i = 0; i < 3; i++) {
      const shape = new THREE.Shape();
      const angle = (i * Math.PI * 2) / 3;

      // Each lobe: rounded fan shape
      shape.moveTo(0, 0);
      const cx = Math.cos(angle) * 0.25;
      const cz = Math.sin(angle) * 0.25;
      const ex = Math.cos(angle) * 0.4;
      const ez = Math.sin(angle) * 0.4;

      // Left edge
      shape.quadraticCurveTo(
        cx - Math.sin(angle) * 0.15,
        cz + Math.cos(angle) * 0.15,
        ex, ez
      );
      // Right edge back
      shape.quadraticCurveTo(
        cx + Math.sin(angle) * 0.15,
        cz - Math.cos(angle) * 0.15,
        0, 0
      );

      const geo = new THREE.ShapeGeometry(shape);
      const lobe = new THREE.Mesh(geo, leafMat);
      lobe.rotation.x = -Math.PI / 2;
      lobe.position.y = 0.01;
      lobe.castShadow = true;
      this.mesh.add(lobe);
    }

    // Thin stem
    const stemGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.3, 6);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3a7a3a, roughness: 0.7 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, -0.1, 0);
    stem.rotation.z = 0.2;
    this.mesh.add(stem);

    // Invisible hit area (larger for forgiving clicks)
    // Sits above clutter (y=0.15) so cilantro is always clickable when visible
    const hitGeo = new THREE.PlaneGeometry(0.5 * scale, 0.5 * scale);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitArea = new THREE.Mesh(hitGeo, hitMat);
    this.hitArea.rotation.x = -Math.PI / 2;
    this.hitArea.position.y = 0.15;
    this.mesh.add(this.hitArea);

    this.mesh.scale.setScalar(scale);
  }
}
