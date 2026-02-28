export class LevelCompleteScreen {
  private el: HTMLElement;
  private statsEl: HTMLElement;
  private levelNumEl: HTMLElement;
  private nextBtn: HTMLElement;
  private onNext: (() => void) | null = null;

  constructor() {
    this.el = document.getElementById("level-complete-screen")!;
    this.statsEl = document.getElementById("lc-stats")!;
    this.levelNumEl = document.getElementById("lc-level-num")!;
    this.nextBtn = document.getElementById("next-level-btn")!;
    this.nextBtn.addEventListener("click", () => {
      this.onNext?.();
    });
  }

  show(level: number, levelScore: number, bonusScore: number, totalScore: number, timeRemaining: number) {
    this.levelNumEl.textContent = String(level);
    this.statsEl.innerHTML = `
      <p>Pick Score: ${levelScore}</p>
      <p>Time Bonus: ${bonusScore}</p>
      <p>Time Left: ${Math.ceil(timeRemaining)}s</p>
      <p class="big-score">Total: ${totalScore}</p>
    `;
    this.el.classList.remove("hidden");
  }

  hide() {
    this.el.classList.add("hidden");
  }

  setOnNext(callback: () => void) {
    this.onNext = callback;
  }
}
