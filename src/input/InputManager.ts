import * as THREE from "three";
import type { SceneManager } from "../scene/SceneManager.ts";
import type { Ingredient } from "../scene/ingredients/Ingredient.ts";

export class InputManager {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private sceneManager: SceneManager;
  private onPick: ((ingredient: Ingredient) => void) | null = null;
  private enabled = false;
  private hoveredIngredient: Ingredient | null = null;

  constructor(sceneManager: SceneManager, canvas: HTMLCanvasElement) {
    this.sceneManager = sceneManager;

    canvas.addEventListener("click", this.onClick);
    canvas.addEventListener("mousemove", this.onMouseMove);
    canvas.addEventListener("touchstart", this.onTouch, { passive: false });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.clearHover();
    }
  }

  setOnPick(callback: (ingredient: Ingredient) => void) {
    this.onPick = callback;
  }

  private updateMouse(clientX: number, clientY: number) {
    this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  }

  private raycast(): Ingredient | null {
    this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);

    // Build a flat list of all clickable meshes and map them back to ingredients
    const allMeshes: THREE.Object3D[] = [];
    const meshToIngredient = new Map<THREE.Object3D, Ingredient>();

    for (const ingredient of this.sceneManager.ingredients) {
      if (ingredient.picked || ingredient.isHidden) continue;

      const meshes = ingredient.getRaycastTargets();
      for (const m of meshes) {
        allMeshes.push(m);
        meshToIngredient.set(m, ingredient);
      }
    }

    // Single raycast against everything, results are sorted by distance
    const intersects = this.raycaster.intersectObjects(allMeshes, false);
    if (intersects.length > 0) {
      return meshToIngredient.get(intersects[0]!.object) ?? null;
    }
    return null;
  }

  private clearHover() {
    if (this.hoveredIngredient) {
      this.hoveredIngredient.setHighlight(false);
      this.hoveredIngredient = null;
    }
    document.body.classList.remove("cursor-pointer");
    document.body.classList.add("cursor-default");
  }

  private onClick = (e: MouseEvent) => {
    if (!this.enabled) return;
    this.updateMouse(e.clientX, e.clientY);
    const hit = this.raycast();
    if (hit && this.onPick) {
      this.onPick(hit);
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.enabled) return;
    this.updateMouse(e.clientX, e.clientY);
    const hit = this.raycast();

    if (hit !== this.hoveredIngredient) {
      if (this.hoveredIngredient) {
        this.hoveredIngredient.setHighlight(false);
      }
      this.hoveredIngredient = hit;
      if (hit) {
        hit.setHighlight(true);
        document.body.classList.add("cursor-pointer");
        document.body.classList.remove("cursor-default");
      } else {
        document.body.classList.remove("cursor-pointer");
        document.body.classList.add("cursor-default");
      }
    }
  };

  private onTouch = (e: TouchEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    this.updateMouse(touch.clientX, touch.clientY);
    const hit = this.raycast();
    if (hit && this.onPick) {
      this.onPick(hit);
    }
  };
}
