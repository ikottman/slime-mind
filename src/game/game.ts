import { turn, turnStore, APP, code } from '../ui/store';
import { Random } from './ai/random';
import { Map } from './models/map';
import { Slime} from "./models/pawns/slime";
import { PlantHandler } from "./handlers/plant_handler";
import Player from './models/player';
import { Action, ACTIONS } from './models/action';

export class Game {
  map: Map;
  plantHandler: PlantHandler;

  constructor() {
    this.map = new Map();
    this.plantHandler = new PlantHandler(this.map);
    this.initializeMap();
    this.run();
  }

  initializeMap() {
    this.map.reset();
    this.placeSlimes();
    this.plantHandler.placeInitialPlants();

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

  private invalidAction(action: Action, playerId: number) {
    if (!action || action.id == undefined || action.id == null || 
      action.x == null || action.x == undefined || 
      action.y == null || action.y == undefined) {
      console.log(`invalid action, something is null: ${JSON.stringify(action)}`);
      return true;
    }

    const target = this.map.sprites.find((s) => s.id == action.id);
    if (!target) {
      console.log(`invalid action, no pawn with the id: ${JSON.stringify(action)}`);
      return true;
    }

    if (target.owner != playerId) {
      console.log(`invalid action, owner does not match ${JSON.stringify(action)}`);
      return true;
    }

    if (!this.map.inBounds(action.x, action.y)) {
      console.log(`invalid action, out of bounds: ${JSON.stringify(action)}`);
      return true;
    }
    
    if (action.action === ACTIONS.MOVE && this.map.cellOccupied(action.x, action.y)) {
      console.log(`invalid action, target square occupied: ${JSON.stringify(action)}`);
      return true;
    }

    if (action.x < target.x - 1 || action.x > target.x + 1 || 
      action.y < target.y - 1 || action.y > target.y + 1) {
      console.log(`invalid action, more than one square away: ${JSON.stringify(action)}`);
      return true;
    }

    return false;
  }

  private executeAction(action: Action, playerId: number) {
    const target = this.map.findById(action.id);
    if (target === null || this.invalidAction(action, playerId)) {
      return;
    }
    switch (action.action) {
      case ACTIONS.MOVE:
        this.map.move(target, action.x, action.y);
        break;
      default:
        console.log(`skipping invalid action: ${action.action}`);
    }
  }

  private updateTurn() {
    turnStore.update(t => t + 1);
    if (turn >= 1000) {
      APP.ticker.stop();
    }
  }

  // private debugAction(action: Action) {
  //   const target = this.sprites.find((s) => s.id == action.id);
  //   if (target) {
  //     console.group(`turn: ${turn}`);
  //     console.log(`action: ${action.action}`);
  //     console.log(`pawnId: ${action.id}`);
  //     console.log(`from: ${target.x} ${target.y}`);
  //     console.log(`to: ${action.x} ${action.y}`);
  //     console.log(`at target: ${this.map[action.x][action.y]}`)
  //     console.groupEnd();
  //   }
  // }

  private loadPlayers() {
    // load player's code
    const ai = eval(`(${code})`); // https://stackoverflow.com/a/39299283

    const playerOne = new Player(1, new ai(1));
    const playerTwo = new Player(2, new Random(2));

    return [playerOne, playerTwo];
  }

  private takeTurn(player: Player) {
    const playerAction = player.ai.takeAction(this.map.readOnlyMap);
    const action = new Action(playerAction.id, playerAction.action, playerAction.x, playerAction.y);
    return this.executeAction(action, player.id);;
  }

  run() {
    try {
      // this is called once per turn
      APP.ticker.add(() => {
        this.updateTurn();
        const [playerOne, playerTwo] = this.loadPlayers();
        this.takeTurn(playerOne);
        this.takeTurn(playerTwo);
        this.plantHandler.takeTurn();
      });
    } catch (exception) {
      console.log(exception);
    }
  }
}