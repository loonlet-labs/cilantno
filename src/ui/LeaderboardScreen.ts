import type { LeaderboardEntry } from "../types.ts";

export class LeaderboardScreen {
  private el: HTMLElement;
  private listEl: HTMLElement;
  private backBtn: HTMLElement;
  private onBack: (() => void) | null = null;

  constructor() {
    this.el = document.getElementById("leaderboard-screen")!;
    this.listEl = document.getElementById("leaderboard-list")!;
    this.backBtn = document.getElementById("leaderboard-back-btn")!;
    this.backBtn.addEventListener("click", () => this.onBack?.());
  }

  async show() {
    this.listEl.innerHTML = '<p class="leaderboard-loading">Loading...</p>';
    this.el.classList.remove("hidden");

    try {
      const res = await fetch("/api/leaderboard");
      const entries: LeaderboardEntry[] = await res.json();
      this.render(entries);
    } catch {
      this.listEl.innerHTML = '<p class="leaderboard-empty">Could not load leaderboard.</p>';
    }
  }

  showWithEntries(entries: LeaderboardEntry[]) {
    this.el.classList.remove("hidden");
    this.render(entries);
  }

  private render(entries: LeaderboardEntry[]) {
    if (entries.length === 0) {
      this.listEl.innerHTML = '<p class="leaderboard-empty">No scores yet. Be the first!</p>';
      return;
    }

    const rows = entries
      .slice(0, 10)
      .map((entry, i) => {
        const rank = i + 1;
        const medal = rank === 1 ? "&#x1F947;" : rank === 2 ? "&#x1F948;" : rank === 3 ? "&#x1F949;" : `${rank}`;
        const levelText = entry.level ? `Lv${entry.level}` : "";
        return `<div class="lb-row${rank <= 3 ? " lb-top" : ""}">
          <span class="lb-rank">${medal}</span>
          <span class="lb-name">${this.escapeHtml(entry.name)}</span>
          <span class="lb-level">${levelText}</span>
          <span class="lb-score">${entry.score.toLocaleString()}</span>
        </div>`;
      })
      .join("");

    this.listEl.innerHTML = rows;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  hide() {
    this.el.classList.add("hidden");
  }

  setOnBack(callback: () => void) {
    this.onBack = callback;
  }
}
