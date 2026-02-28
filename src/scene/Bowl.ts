import * as THREE from "three";

export class Bowl {
  mesh: THREE.Group;

  constructor() {
    this.mesh = new THREE.Group();

    // Bowl — LatheGeometry for rounded ceramic shape
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const x = 1.5 + Math.sin(t * Math.PI * 0.55) * 1.8;
      const y = t * 1.8 - 0.5;
      points.push(new THREE.Vector2(x, y));
    }

    const bowlGeo = new THREE.LatheGeometry(points, 48);
    const bowlMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0e8,
      roughness: 0.3,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const bowlMesh = new THREE.Mesh(bowlGeo, bowlMat);
    bowlMesh.castShadow = true;
    bowlMesh.receiveShadow = true;
    this.mesh.add(bowlMesh);

    // Inner salad base (flat disc to represent bottom of salad)
    const baseGeo = new THREE.CircleGeometry(2.0, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x8b8960,
      roughness: 0.85,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.rotation.x = -Math.PI / 2;
    base.position.y = -0.14;
    this.mesh.add(base);
  }
}
