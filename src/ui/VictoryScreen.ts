interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle";
}

export class VictoryScreen {
  private el: HTMLElement;
  private scoreEl: HTMLElement;
  private playAgainBtn: HTMLElement;
  private confettiCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animFrame = 0;
  private onPlayAgain: (() => void) | null = null;

  private readonly colors = [
    "#4ecdc4", "#ffe66d", "#ff6b9d", "#c678dd",
    "#61afef", "#98c379", "#e5c07b", "#ff8c42",
  ];

  constructor() {
    this.el = document.getElementById("victory-screen")!;
    this.scoreEl = document.getElementById("victory-score")!;
    this.playAgainBtn = document.getElementById("play-again-btn")!;
    this.confettiCanvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
    this.ctx = this.confettiCanvas.getContext("2d")!;

    this.playAgainBtn.addEventListener("click", () => {
      this.stop();
      this.onPlayAgain?.();
    });
  }

  show(totalScore: number) {
    this.scoreEl.textContent = totalScore.toLocaleString();
    this.el.classList.remove("hidden");

    // Reset animations by removing and re-adding the active class
    this.el.classList.remove("active");
    void this.el.offsetWidth; // force reflow
    this.el.classList.add("active");

    // Size confetti canvas
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;

    // Launch confetti
    this.particles = [];
    this.burst(window.innerWidth / 2, window.innerHeight * 0.3, 80);
    setTimeout(() => this.burst(window.innerWidth * 0.25, window.innerHeight * 0.4, 50), 400);
    setTimeout(() => this.burst(window.innerWidth * 0.75, window.innerHeight * 0.4, 50), 600);
    setTimeout(() => this.burst(window.innerWidth * 0.5, window.innerHeight * 0.2, 40), 1000);

    // Continuous gentle confetti rain
    this.startRain();

    this.animate();
  }

  private burst(x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 4 + Math.random() * 8,
        color: this.colors[Math.floor(Math.random() * this.colors.length)]!,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }
  }

  private startRain() {
    const addRain = () => {
      if (this.el.classList.contains("hidden")) return;
      for (let i = 0; i < 3; i++) {
        this.particles.push({
          x: Math.random() * window.innerWidth,
          y: -10,
          vx: (Math.random() - 0.5) * 1,
          vy: 1 + Math.random() * 2,
          size: 3 + Math.random() * 5,
          color: this.colors[Math.floor(Math.random() * this.colors.length)]!,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          opacity: 0.8,
          shape: Math.random() > 0.5 ? "rect" : "circle",
        });
      }
      setTimeout(addRain, 200);
    };
    setTimeout(addRain, 1500);
  }

  private animate = () => {
    if (this.el.classList.contains("hidden")) return;
    this.animFrame = requestAnimationFrame(this.animate);

    this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]!;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.vx *= 0.99; // air resistance
      p.rotation += p.rotationSpeed;

      // Fade out as particles fall past screen
      if (p.y > this.confettiCanvas.height * 0.7) {
        p.opacity -= 0.015;
      }

      if (p.opacity <= 0 || p.y > this.confettiCanvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  };

  hide() {
    this.stop();
    this.el.classList.add("hidden");
    this.el.classList.remove("active");
  }

  private stop() {
    cancelAnimationFrame(this.animFrame);
    this.particles = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
  }

  setOnPlayAgain(callback: () => void) {
    this.onPlayAgain = callback;
  }
}
