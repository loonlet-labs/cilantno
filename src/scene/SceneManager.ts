import * as THREE from "three";
import { Bowl } from "./Bowl.ts";
import { Cilantro } from "./ingredients/Cilantro.ts";
import { Lettuce } from "./ingredients/Lettuce.ts";
import { Tomato } from "./ingredients/Tomato.ts";
import { Cucumber } from "./ingredients/Cucumber.ts";
import { Crouton } from "./ingredients/Crouton.ts";
import { Parsley } from "./ingredients/Parsley.ts";
import { Onion } from "./ingredients/Onion.ts";
import type { Ingredient } from "./ingredients/Ingredient.ts";
import type { LevelConfig } from "../types.ts";

export class SceneManager {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  bowl: Bowl;
  ingredients: Ingredient[] = [];
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;

  private bowlRadius = 3.2;
  private bowlInnerRadius = 2.8;
  private placementRadius = 1.8;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2d1b4e);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 7, 5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.directionalLight.position.set(3, 8, 4);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 20;
    this.directionalLight.shadow.camera.left = -5;
    this.directionalLight.shadow.camera.right = 5;
    this.directionalLight.shadow.camera.top = 5;
    this.directionalLight.shadow.camera.bottom = -5;
    this.scene.add(this.directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffe4c4, 0.3);
    fillLight.position.set(-3, 4, -2);
    this.scene.add(fillLight);

    // Table surface
    const tableGeo = new THREE.PlaneGeometry(20, 20);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x8b6914,
      roughness: 0.8,
      metalness: 0.1,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.rotation.x = -Math.PI / 2;
    table.position.y = -0.5;
    table.receiveShadow = true;
    this.scene.add(table);

    // Bowl
    this.bowl = new Bowl();
    this.scene.add(this.bowl.mesh);

    window.addEventListener("resize", this.onResize);
  }

  setLightIntensity(intensity: number) {
    this.directionalLight.intensity = intensity;
    this.ambientLight.intensity = 0.3 + intensity * 0.2;
  }

  loadLevel(config: LevelConfig) {
    this.clearIngredients();
    this.setLightIntensity(config.lightIntensity);

    const positions = this.generatePositions(
      config.cilantroCount + config.clutterCount + config.parsleyCount
    );

    let posIdx = 0;

    // Place cilantro
    for (let i = 0; i < config.cilantroCount; i++) {
      const pos = positions[posIdx++]!;
      const hidden = i < config.hiddenCount;
      const c = new Cilantro(config.cilantroScale);
      c.place(pos.x, pos.y, pos.z);
      if (hidden) c.setHidden(true);
      this.ingredients.push(c);
      this.scene.add(c.mesh);
    }

    // Place parsley decoys
    for (let i = 0; i < config.parsleyCount; i++) {
      const pos = positions[posIdx++]!;
      const p = new Parsley(config.cilantroScale);
      p.place(pos.x, pos.y, pos.z);
      this.ingredients.push(p);
      this.scene.add(p.mesh);
    }

    // Place clutter
    const clutterTypes = ["lettuce", "tomato", "cucumber", "crouton", "onion"] as const;
    for (let i = 0; i < config.clutterCount; i++) {
      const pos = positions[posIdx++]!;
      const type = clutterTypes[i % clutterTypes.length]!;
      let ing: Ingredient;
      switch (type) {
        case "lettuce": ing = new Lettuce(); break;
        case "tomato": ing = new Tomato(); break;
        case "cucumber": ing = new Cucumber(); break;
        case "crouton": ing = new Crouton(); break;
        case "onion": ing = new Onion(); break;
      }
      ing.place(pos.x, pos.y, pos.z);
      this.ingredients.push(ing);
      this.scene.add(ing.mesh);
    }

    // Place lettuce covers over hidden cilantro
    for (const ing of this.ingredients) {
      if (ing.type === "cilantro" && ing.isHidden) {
        const cover = new Lettuce();
        cover.place(ing.mesh.position.x, ing.mesh.position.y + 0.08, ing.mesh.position.z);
        cover.isCover = true;
        this.ingredients.push(cover);
        this.scene.add(cover.mesh);
      }
    }
  }

  private generatePositions(count: number): THREE.Vector3[] {
    const positions: THREE.Vector3[] = [];
    const r = this.placementRadius;
    // Scale minimum distance based on density — tighter packing for more items
    const minDist = Math.max(0.3, Math.min(0.6, r * 1.4 / Math.sqrt(count)));

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let pos: THREE.Vector3;
      do {
        const angle = Math.random() * Math.PI * 2;
        // Bias towards edges for better spread (sqrt for uniform area distribution)
        const dist = Math.sqrt(Math.random()) * r;
        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist;
        // Place on bowl surface — slight rise towards edges
        const distFromCenter = Math.sqrt(x * x + z * z);
        const y = -0.15 + distFromCenter * 0.04 + Math.random() * 0.03;
        pos = new THREE.Vector3(x, y, z);
        attempts++;
      } while (attempts < 200 && positions.some(p => p.distanceTo(pos!) < minDist));
      positions.push(pos);
    }
    return positions;
  }

  shiftIngredientsNear(origin: THREE.Vector3, radius: number = 0.8) {
    for (const ing of this.ingredients) {
      if (ing.picked) continue;
      const dist = ing.mesh.position.distanceTo(origin);
      if (dist < radius && dist > 0.01) {
        const dir = ing.mesh.position.clone().sub(origin).normalize();
        const shiftAmount = (radius - dist) * 0.3;
        const newPos = ing.mesh.position.clone().add(dir.multiplyScalar(shiftAmount));
        // Keep inside bowl
        const distFromCenter = Math.sqrt(newPos.x ** 2 + newPos.z ** 2);
        if (distFromCenter < this.placementRadius) {
          ing.animateShift(newPos);
        }
      }
    }
  }

  revealHiddenAt(origin: THREE.Vector3) {
    for (const ing of this.ingredients) {
      if (ing.type === "cilantro" && ing.isHidden) {
        const dist = ing.mesh.position.distanceTo(origin);
        if (dist < 0.6) {
          ing.setHidden(false);
        }
      }
    }
  }

  clearIngredients() {
    for (const ing of this.ingredients) {
      this.scene.remove(ing.mesh);
      ing.dispose();
    }
    this.ingredients = [];
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
}
