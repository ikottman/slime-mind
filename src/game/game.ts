import { turnStore, scoresStore, APP, textHandler } from '../ui/store';
import { Map } from './models/map';
import { PlantHandler } from "./handlers/plant_handler";
import { RockHandler } from "./handlers/rock_handler";
import { AiHandler } from "./handlers/ai_handler";
import { ScoreHandler } from "./handlers/score_handler";
import { VictoryHandler } from "./handlers/victory_handler";
import { SlimeHandler } from "./handlers/slime_handler";

export class Game {
  map: Map;
  plantHandler: PlantHandler;
  rockHandler: RockHandler;
  slimeHandler: SlimeHandler;
  aiHandler: AiHandler;
  scoreHandler: ScoreHandler;
  victoryHandler: VictoryHandler;

  constructor() {
    this.map = new Map();
    this.slimeHandler = new SlimeHandler(this.map);
    this.plantHandler = new PlantHandler(this.map);
    this.rockHandler = new RockHandler(this.map);
    this.aiHandler = new AiHandler(this.map);
    this.scoreHandler = new ScoreHandler(this.map);
    this.victoryHandler = new VictoryHandler(this.map);
    this.reset();
    this.run();
  }

  reset(): void {
    APP.ticker.stop();
    APP.stage.removeChildren();
    textHandler.clearAllTexts();
    turnStore.update(_ => 0);
    scoresStore.update(_ => [0, 0])
    this.map.reset();
    this.slimeHandler.placeSlimes();
    this.plantHandler.placeInitialPlants();
    this.rockHandler.placeRocks();
    this.aiHandler.loadAis();
    // wait on GPU to receive all our assets before rendering the stage
    // prevents a weird glitches on first page load
    APP.renderer.plugins.prepare.upload(APP.stage, () => {
      APP.renderer.render(APP.stage);
    });
  }

  private updateTurn() {
    turnStore.update(t => t + 1);
  }

  run() {
    // this is called once per turn
    APP.ticker.add(() => {
      this.updateTurn();
      if (this.victoryHandler.isGameOver()) {
        this.victoryHandler.endGame();
        return;
      }
      this.plantHandler.takeTurn();
      this.aiHandler.takeTurn();
      this.scoreHandler.updateScores();
      textHandler.takeTurn();
    });
  }
}