export class MenuScreen {
  private el: HTMLElement;
  private startBtn: HTMLElement;
  private onStart: (() => void) | null = null;

  constructor() {
    this.el = document.getElementById("menu-screen")!;
    this.startBtn = document.getElementById("start-btn")!;
    this.startBtn.addEventListener("click", () => {
      this.onStart?.();
    });
  }

  show() {
    this.el.classList.remove("hidden");
  }

  hide() {
    this.el.classList.add("hidden");
  }

  setOnStart(callback: () => void) {
    this.onStart = callback;
  }
}
