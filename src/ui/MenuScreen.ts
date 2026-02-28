export class MenuScreen {
  private el: HTMLElement;
  private startBtn: HTMLElement;
  private leaderboardBtn: HTMLElement;
  private onStart: (() => void) | null = null;
  private onLeaderboard: (() => void) | null = null;

  constructor() {
    this.el = document.getElementById("menu-screen")!;
    this.startBtn = document.getElementById("start-btn")!;
    this.leaderboardBtn = document.getElementById("leaderboard-btn")!;
    this.startBtn.addEventListener("click", () => this.onStart?.());
    this.leaderboardBtn.addEventListener("click", () => this.onLeaderboard?.());
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

  setOnLeaderboard(callback: () => void) {
    this.onLeaderboard = callback;
  }
}
