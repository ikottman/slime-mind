import { turn, turnStore, scoresStore, APP } from '../ui/store';
import { Map } from './models/map';
import { Slime} from "./models/pawns/slime";
import { PlantHandler } from "./handlers/plant_handler";
import { AiHandler } from "./handlers/ai_handler";
import { ScoreHandler } from "./handlers/score_handler";

export class Game {
  map: Map;
  plantHandler: PlantHandler;
  aiHandler: AiHandler;
  scoreHandler: ScoreHandler;

  constructor() {
    this.map = new Map();
    this.plantHandler = new PlantHandler(this.map);
    this.aiHandler = new AiHandler(this.map);
    this.scoreHandler = new ScoreHandler(this.map);
    this.reset();
    this.run();
  }

  reset(): void {
    turnStore.update(_ => 0);
    scoresStore.update(_ => [0, 0])
    this.map.reset();
    this.placeSlimes();
    this.plantHandler.placeInitialPlants();
    this.aiHandler.loadAis();

    // show beginning state
    APP.renderer.render(APP.stage);
  }

  private addSlime(x: number, y: number, owner: number) {
    const slime = new Slime(owner, x, y);
    this.map.placeNew(slime);
  }

  private placeSlimes() {
    // hardcoded layout
    this.addSlime(0, 2, 1);
    this.addSlime(0, 7, 1);
    this.addSlime(0, 12, 1);
    this.addSlime(0, 17, 1);
    this.addSlime(0, 22, 1);

    this.addSlime(24, 2, 2);
    this.addSlime(24, 7, 2);
    this.addSlime(24, 12, 2);
    this.addSlime(24, 17, 2);
    this.addSlime(24, 22, 2);
  }

  private playerOutOfSlimes(): boolean {
    const one = this.map.sprites.filter(s => s.owner === 1);
    const two = this.map.sprites.filter(s => s.owner === 2);
    return one.length === 0 || two.length === 0;
  }

  private updateTurn() {
    turnStore.update(t => t + 1);
    if (turn >= 1000 || this.playerOutOfSlimes()) {
      APP.ticker.stop();
    }
  }

  run() {
    // this is called once per turn
    APP.ticker.add(() => {
      this.updateTurn();
      this.plantHandler.takeTurn();
      this.aiHandler.takeTurn();
      this.scoreHandler.updateScores();
    });
  }
}