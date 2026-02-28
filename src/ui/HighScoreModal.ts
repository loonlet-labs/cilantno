import type { LeaderboardEntry } from "../types.ts";

export class HighScoreModal {
  private el: HTMLElement;
  private scoreEl: HTMLElement;
  private nameInput: HTMLInputElement;
  private submitBtn: HTMLElement;
  private skipBtn: HTMLElement;
  private onSubmit: ((name: string) => void) | null = null;
  private onSkip: (() => void) | null = null;

  constructor() {
    this.el = document.getElementById("highscore-modal")!;
    this.scoreEl = document.getElementById("highscore-value")!;
    this.nameInput = document.getElementById("highscore-name") as HTMLInputElement;
    this.submitBtn = document.getElementById("highscore-submit-btn")!;
    this.skipBtn = document.getElementById("highscore-skip-btn")!;

    this.submitBtn.addEventListener("click", () => this.handleSubmit());
    this.skipBtn.addEventListener("click", () => this.onSkip?.());
    this.nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handleSubmit();
    });
  }

  show(score: number) {
    this.scoreEl.textContent = score.toLocaleString();
    this.nameInput.value = "";
    this.submitBtn.textContent = "SUBMIT";
    this.submitBtn.classList.remove("disabled");
    this.el.classList.remove("hidden");
    setTimeout(() => this.nameInput.focus(), 100);
  }

  hide() {
    this.el.classList.add("hidden");
  }

  private handleSubmit() {
    const name = this.nameInput.value.trim();
    if (!name) {
      this.nameInput.classList.add("shake");
      setTimeout(() => this.nameInput.classList.remove("shake"), 500);
      return;
    }
    this.submitBtn.textContent = "SAVING...";
    this.submitBtn.classList.add("disabled");
    this.onSubmit?.(name);
  }

  setOnSubmit(callback: (name: string) => void) {
    this.onSubmit = callback;
  }

  setOnSkip(callback: () => void) {
    this.onSkip = callback;
  }
}
