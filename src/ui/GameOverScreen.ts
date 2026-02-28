export class GameOverScreen {
  private el: HTMLElement;
  private scoreEl: HTMLElement;
  private retryBtn: HTMLElement;
  private onRetry: (() => void) | null = null;

  constructor() {
    this.el = document.getElementById("game-over-screen")!;
    this.scoreEl = document.getElementById("go-score")!;
    this.retryBtn = document.getElementById("retry-btn")!;
    this.retryBtn.addEventListener("click", () => {
      this.onRetry?.();
    });
  }

  show(score: number, level: number) {
    this.scoreEl.textContent = `Score: ${score} (Level ${level})`;
    this.el.classList.remove("hidden");
  }

  hide() {
    this.el.classList.add("hidden");
  }

  setOnRetry(callback: () => void) {
    this.onRetry = callback;
  }
}
