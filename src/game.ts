import type { GameState, GameStateType } from "./types.ts";
import { LEVELS } from "./levels.ts";
import { SceneManager } from "./scene/SceneManager.ts";
import { InputManager } from "./input/InputManager.ts";
import { AudioManager } from "./audio/AudioManager.ts";
import { HUD } from "./ui/HUD.ts";
import { MenuScreen } from "./ui/MenuScreen.ts";
import { LevelCompleteScreen } from "./ui/LevelCompleteScreen.ts";
import { GameOverScreen } from "./ui/GameOverScreen.ts";
import { VictoryScreen } from "./ui/VictoryScreen.ts";
import type { Ingredient } from "./scene/ingredients/Ingredient.ts";

const TOTAL_TIME = 60;

export class Game {
  private sceneManager: SceneManager;
  private inputManager: InputManager;
  private audio: AudioManager;
  private hud: HUD;
  private menuScreen: MenuScreen;
  private levelCompleteScreen: LevelCompleteScreen;
  private gameOverScreen: GameOverScreen;
  private victoryScreen: VictoryScreen;

  private state: GameState = {
    state: "menu",
    level: 1,
    score: 0,
    totalScore: 0,
    timeRemaining: TOTAL_TIME,
    cilantroRemaining: 0,
    cilantroTotal: 0,
  };

  private lastTime = 0;
  private animFrameId = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.sceneManager = new SceneManager(canvas);
    this.inputManager = new InputManager(this.sceneManager, canvas);
    this.audio = new AudioManager();
    this.hud = new HUD();
    this.menuScreen = new MenuScreen();
    this.levelCompleteScreen = new LevelCompleteScreen();
    this.gameOverScreen = new GameOverScreen();
    this.victoryScreen = new VictoryScreen();

    this.inputManager.setOnPick((ingredient) => this.handlePick(ingredient));

    this.menuScreen.setOnStart(() => this.startGame());
    this.levelCompleteScreen.setOnNext(() => this.nextLevel());
    this.gameOverScreen.setOnRetry(() => this.returnToMenu());
    this.victoryScreen.setOnPlayAgain(() => this.returnToMenu());

    this.setState("menu");
    this.loop(0);
  }

  private setState(newState: GameStateType) {
    this.state.state = newState;

    // Hide all screens
    this.menuScreen.hide();
    this.levelCompleteScreen.hide();
    this.gameOverScreen.hide();
    this.victoryScreen.hide();
    this.hud.hide();

    switch (newState) {
      case "menu":
        this.menuScreen.show();
        this.inputManager.setEnabled(false);
        break;
      case "playing":
        this.hud.show();
        this.inputManager.setEnabled(true);
        break;
      case "levelComplete":
        this.inputManager.setEnabled(false);
        break;
      case "gameOver":
        this.inputManager.setEnabled(false);
        this.audio.playGameOver();
        this.gameOverScreen.show(this.state.totalScore + this.state.score, this.state.level);
        break;
      case "victory":
        this.inputManager.setEnabled(false);
        this.audio.playVictory();
        this.victoryScreen.show(this.state.totalScore + this.state.score);
        break;
    }
  }

  private startGame() {
    this.state.level = 1;
    this.state.totalScore = 0;
    this.state.score = 0;
    this.startLevel();
  }

  private startLevel() {
    const config = LEVELS[this.state.level - 1]!;
    this.state.timeRemaining = TOTAL_TIME;
    this.state.score = 0;
    this.state.cilantroTotal = config.cilantroCount;
    this.state.cilantroRemaining = config.cilantroCount;

    this.sceneManager.loadLevel(config);
    this.setState("playing");
  }

  private nextLevel() {
    this.state.level++;
    if (this.state.level > LEVELS.length) {
      this.setState("victory");
    } else {
      this.startLevel();
    }
  }

  private returnToMenu() {
    this.sceneManager.clearIngredients();
    this.state.level = 1;
    this.state.totalScore = 0;
    this.state.score = 0;
    this.setState("menu");
  }

  private handlePick(ingredient: Ingredient) {
    if (this.state.state !== "playing" || ingredient.picked) return;

    const config = LEVELS[this.state.level - 1]!;

    // If it's a cover lettuce, remove it and reveal hidden pieces
    if (ingredient.isCover) {
      const coverPos = ingredient.mesh.position.clone();
      ingredient.animatePick(() => {
        this.sceneManager.revealHiddenAt(coverPos);
      });
      this.audio.playReveal();
      return;
    }

    if (ingredient.type === "cilantro") {
      // Correct pick
      const pickScore = Math.floor(100 * this.state.level * (this.state.timeRemaining / TOTAL_TIME));
      this.state.score += pickScore;
      this.state.cilantroRemaining--;

      this.audio.playPick();
      this.showFloatingScore(ingredient, `+${pickScore}`);

      const pickPos = ingredient.mesh.position.clone();
      ingredient.animatePick(() => {
        if (config.ingredientShift) {
          this.sceneManager.shiftIngredientsNear(pickPos);
        }
      });

      // Check level complete
      if (this.state.cilantroRemaining <= 0) {
        const bonusScore = Math.floor(this.state.timeRemaining * 50 * this.state.level);
        this.state.score += bonusScore;
        this.state.totalScore += this.state.score;

        setTimeout(() => {
          this.audio.playLevelComplete();
          if (this.state.level >= LEVELS.length) {
            this.setState("victory");
          } else {
            this.levelCompleteScreen.show(
              this.state.score - bonusScore,
              bonusScore,
              this.state.totalScore,
              this.state.timeRemaining
            );
            this.setState("levelComplete");
            // Re-show the level complete screen since setState hides everything
            this.levelCompleteScreen.show(
              this.state.score - bonusScore,
              bonusScore,
              this.state.totalScore,
              this.state.timeRemaining
            );
          }
        }, 500);
      }
    } else {
      // Wrong pick
      if (config.wrongPenalty > 0) {
        this.state.timeRemaining = Math.max(0, this.state.timeRemaining - config.wrongPenalty);
        this.showFloatingScore(ingredient, `-${config.wrongPenalty}s`, true);
      }
      this.audio.playWrongPick();
      ingredient.animateWrongPick();
    }
  }

  private showFloatingScore(ingredient: Ingredient, text: string, isPenalty = false) {
    const pos = ingredient.mesh.position.clone();
    pos.project(this.sceneManager.camera);

    const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;

    const el = document.createElement("div");
    el.className = `float-score${isPenalty ? " penalty" : ""}`;
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 1000);
  }

  private loop = (time: number) => {
    this.animFrameId = requestAnimationFrame(this.loop);

    const dt = this.lastTime ? (time - this.lastTime) / 1000 : 0;
    this.lastTime = time;

    if (this.state.state === "playing") {
      // Update timer
      const prevTime = this.state.timeRemaining;
      this.state.timeRemaining -= dt;

      if (this.hud.shouldTick(this.state.timeRemaining)) {
        this.audio.playTick();
      }

      if (this.state.timeRemaining <= 0) {
        this.state.timeRemaining = 0;
        this.setState("gameOver");
      }

      // Update ingredients
      for (const ing of this.sceneManager.ingredients) {
        ing.update(dt);
      }

      this.hud.update(this.state);
    }

    this.sceneManager.render();
  };
}
