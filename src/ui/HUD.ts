import type { GameState } from "../types.ts";

export class HUD {
  private el: HTMLElement;
  private timerEl: HTMLElement;
  private scoreEl: HTMLElement;
  private levelEl: HTMLElement;
  private cilantroEl: HTMLElement;
  private lastSecond = -1;

  constructor() {
    this.el = document.getElementById("hud")!;
    this.timerEl = document.getElementById("hud-timer")!;
    this.scoreEl = document.getElementById("hud-score")!;
    this.levelEl = document.getElementById("hud-level")!;
    this.cilantroEl = document.getElementById("hud-cilantro-count")!;
  }

  show() {
    this.el.classList.remove("hidden");
  }

  hide() {
    this.el.classList.add("hidden");
  }

  update(state: GameState) {
    const seconds = Math.ceil(state.timeRemaining);
    this.timerEl.textContent = String(seconds);
    this.scoreEl.textContent = `Score: ${state.totalScore + state.score}`;
    this.levelEl.textContent = `Level ${state.level}`;

    const picked = state.cilantroTotal - state.cilantroRemaining;
    this.cilantroEl.textContent = `${picked} / ${state.cilantroTotal}`;

    // Warning state when time is low
    if (seconds <= 10) {
      this.timerEl.classList.add("warning");
    } else {
      this.timerEl.classList.remove("warning");
    }

    this.lastSecond = seconds;
  }

  shouldTick(timeRemaining: number): boolean {
    const seconds = Math.ceil(timeRemaining);
    if (seconds !== this.lastSecond && seconds <= 10) {
      return true;
    }
    return false;
  }
}
