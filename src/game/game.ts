import { turnStore, turn, scoresStore, APP, bus, tournamentMode } from '../ui/store';
import { isGameOver } from './utils';
import { Map } from './models/map';
import { PlantHandler } from "./handlers/plant_handler";
import { RockHandler } from "./handlers/rock_handler";
import { AiHandler } from "./handlers/ai_handler";
import { ScoreHandler } from "./handlers/score_handler";
import { VictoryHandler } from "./handlers/victory_handler";
import { SlimeHandler } from "./handlers/slime_handler";
import { TextHandler } from "./handlers/text_handler";
import { EVENT_KEY } from './schema';

export class Game {
  map: Map;
  plantHandler: PlantHandler;
  rockHandler: RockHandler;
  slimeHandler: SlimeHandler;
  aiHandler: AiHandler;
  scoreHandler: ScoreHandler;
  victoryHandler: VictoryHandler;
  textHandler?: TextHandler;

  constructor() {
    this.map = new Map();
    this.slimeHandler = new SlimeHandler(this.map);
    this.plantHandler = new PlantHandler(this.map);
    this.rockHandler = new RockHandler(this.map);
    this.aiHandler = new AiHandler(this.map);
    this.scoreHandler = new ScoreHandler(this.map);
    this.victoryHandler = new VictoryHandler();
    this.reset();
    this.run();
  }

  reset(): void {
    APP.ticker.stop();
    APP.stage.removeChildren();
    turnStore.update(_ => 0);
    scoresStore.update(_ => [0, 0])
    this.map.reset();
    this.plantHandler.placeInitialPlants();
    this.rockHandler.placeRocks();
    this.aiHandler.loadAis();
    this.victoryHandler.reset();
    bus.emit(EVENT_KEY.RESET);
    bus.process();
    // wait on GPU to receive all our assets before rendering the stage
    // prevents weird glitches on first page load
    APP.renderer.plugins.prepare.upload(APP.stage, () => {
      APP.renderer.render(APP.stage);
    });
  }

  private updateTurn(): void {
    turnStore.update(t => t + 1);
  }

  // returns true if the game is over
  gameLoop(): boolean {
    this.updateTurn();
    if (isGameOver(this.map, turn)) {
      this.victoryHandler.endGame();
      bus.emit(EVENT_KEY.END_GAME)
      return true;
    }
    this.plantHandler.takeTurn();
    this.aiHandler.takeTurn();
    bus.emit(EVENT_KEY.END_TURN)
    bus.process();
    this.scoreHandler.updateScores();
    return false;
  }

  run(): void {
    if (!tournamentMode) {
      // render text when slimes do stuff like split or merge
      this.textHandler = new TextHandler();
    }
    // run gameLoop each turn and render results
    APP.ticker.add(this.gameLoop.bind(this));
  }
}