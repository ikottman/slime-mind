import { turn, turnStore, scoresStore, APP, textHandler } from '../ui/store';
import { Map } from './models/map';
import { Slime} from "./models/slime";
import { PlantHandler } from "./handlers/plant_handler";
import { AiHandler } from "./handlers/ai_handler";
import { ScoreHandler } from "./handlers/score_handler";
import { GRID_SIZE } from '../ui/store';
import { randomInt } from './utils';

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
    // wait on GPU to receive all our assets before rendering the stage
    // prevents a weird glitches on first page load
    APP.renderer.plugins.prepare.upload(APP.stage, () => {
      APP.renderer.render(APP.stage);
    });
  }

  private addSlime(x: number, y: number, owner: number) {
    const slime = new Slime(owner, x, y);
    this.map.move(slime, x, y);
  }

  private placeSlimes() {
    // Randomly choose spots to place the slimes on the far left colomn then mirror them to the far right

    const numSlimeStart = 5;
    let tries = 0;
    let numSlimes = 0;

    do {
      tries++
      const y = randomInt(0, GRID_SIZE-1);
      if (!this.map.invalidMove(0, y)&&!this.map.invalidMove(GRID_SIZE-1, y)) {
        this.addSlime(0, y, 1);
        this.addSlime(GRID_SIZE-1, y, 2);
        numSlimes++
      }
    }
    while (tries < 100000 && numSlimes < numSlimeStart);
  }

  private playerOutOfSlimes(): boolean {
    const one = this.map.pawns.filter(pawn => pawn.owner === 1);
    const two = this.map.pawns.filter(pawn => pawn.owner === 2);
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
      textHandler.takeTurn();
    });
  }
}