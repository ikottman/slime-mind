import { turnStore, turn, scoresStore, APP, bus, map, tournamentMode } from '../ui/store';
import { isGameOver } from './utils';
import { PlantHandler } from "./handlers/plant_handler";
import { RockHandler } from "./handlers/rock_handler";
import { AiHandler } from "./handlers/ai_handler";
import { ScoreHandler } from "./handlers/score_handler";
import { VictoryHandler } from "./handlers/victory_handler";
import { SlimeHandler } from "./handlers/slime_handler";
import { TextHandler } from "./handlers/text_handler";
import { MapHandler } from "./handlers/map_handler";
import { SlimeRenderer } from "./handlers/slime_renderer";
import { EVENT_KEY } from './schema';

export class Game {
  constructor() {
    // handlers do all the game logic based on events like START_TUNE, MERGE, KILLED...
    if (!tournamentMode) {
      // render text when slimes do stuff like split or merge
      new TextHandler();
      new SlimeRenderer();
    }
    // order somewhat matters, each handler subscribes to events when created
    // so the PlantHandler logic _always_ runs before SlimeHandler for the same event
    new MapHandler();
    new PlantHandler();
    new SlimeHandler();
    new RockHandler();
    new AiHandler();
    new ScoreHandler();
    new VictoryHandler();
    this.reset();
    this.run();
  }

  reset(): void {
    APP.ticker.stop();
    APP.stage.removeChildren();
    turnStore.update(_ => 0);
    scoresStore.update(_ => [0, 0])
    bus.emit(EVENT_KEY.RESET);
    // wait on GPU to receive all our assets before rendering the stage
    // prevents weird glitches on first page load
    APP.renderer.plugins.prepare.upload(APP.stage, () => {
      APP.renderer.render(APP.stage);
    });
  }

  // returns true if the game is over
  gameLoop(): boolean {
    turnStore.update(t => t + 1);
    bus.emit(EVENT_KEY.START_TURN);
    bus.emit(EVENT_KEY.END_TURN);
    if (isGameOver(turn)) {
      bus.emit(EVENT_KEY.END_GAME);
      return true;
    }
    return false;
  }

  run(): void {
    // run gameLoop each turn and render results
    APP.ticker.add(this.gameLoop.bind(this));
  }
}