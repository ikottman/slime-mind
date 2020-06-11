import { PAWN_TYPE, Pawn } from './schema';
import { turn, turnStore, APP, GRID_SIZE, code } from '../ui/store';
import { Random } from './ai/random';
import { Sprite } from './models/sprite';
import { Slime} from "./models/pawns/slime";
import { Plant } from "./models/pawns/plant";
import Player from './models/player';
import { Action, ACTIONS } from './models/action';
import { inBounds, randomInt } from './utils';

export default class Game {
  // all the sprites on the grid. An empty space is null
  map: Array<Array< Pawn | null>> = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
  sprites: Array<Sprite> = [];

  constructor() {
    this.initializeMap();
  }

  initializeMap() {
    // reset state
    this.map = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
    this.sprites = [];

    this.placeSlimes();

    this.placePlants();

    // show beginning state
    APP.renderer.render(APP.stage);
  }

  private addSlime(x: number, y: number, owner: number) {
    const slime = new Slime(owner, x, y);
    this.map[x][y] = slime;
    this.sprites.push(new Sprite(slime));
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

  private placePlants() {
    // attempt to fill 10% of the map with plants
    for (let i = 0; i < GRID_SIZE / 10; i ++) {
      const x = randomInt(0, GRID_SIZE);
      const y = randomInt(0, GRID_SIZE);
      if (!this.invalidMove(x, y)) {
        const plant = new Plant(x, y);
        this.sprites.push(new Sprite(plant));
        this.map[x][y] = plant;
      }
    }
  }

  private spaceOccupied(x: number, y: number) {
    return this.map[x][y] != null;
  }
  
  private invalidMove(x?: number, y?: number) {
    return x == null || x == undefined || 
        y == null || y == undefined ||
        !inBounds(x, y) ||
        this.spaceOccupied(x, y);
  }

  // return list of all valid empty spaces surrounding a point
  // if none returns empty list
  private emptySpaces(x: number, y: number) {
    const options = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    return options.filter(pt => !this.invalidMove(x + pt[0], y + pt[1])).map(pt => [x + pt[0], y + pt[1]]);
  }

  // occasionally have plants replicate
  private growPlants() {
    this.sprites
    .filter((s) => s.type == PAWN_TYPE.PLANT)
    .forEach((plant) => {
      if (randomInt(0, 100) < 1) {
        const options = this.emptySpaces(plant.x, plant.y);
        if (options.length > 0) {
          const [x, y] = options[randomInt(0, options.length - 1)];
          const plant = new Plant(x, y);
          this.map[x][y] = plant;
          this.sprites.push(new Sprite(plant));
        }
      }
    });
  }

  private invalidAction(action: Action, playerId: number) {
    if (!action || action.id == undefined || action.id == null || 
      action.x == null || action.x == undefined || 
      action.y == null || action.y == undefined) {
      console.log(`invalid action, something is null: ${JSON.stringify(action)}`);
      return true;
    }

    const target = this.sprites.find((s) => s.id == action.id);
    if (!target) {
      console.log(`invalid action, no pawn with the id: ${JSON.stringify(action)}`);
      return true;
    }

    if (target.pawn.owner != playerId) {
      console.log(`invalid action, owner does not match ${JSON.stringify(action)}`);
      return true;
    }

    if (!inBounds(action.x, action.y)) {
      console.log(`invalid action, out of bounds: ${JSON.stringify(action)}`);
      return true;
    }
    
    if (action.action === ACTIONS.MOVE && this.spaceOccupied(action.x, action.y)) {
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
    const target = this.sprites.find((s) => s.id === action.id);
    if (this.invalidAction(action, playerId) || target === undefined) {
      return;
    }
    switch (action.action) {
      case ACTIONS.MOVE:
        // no-op moving to current location
        if (target.x === action.x && target.y === action.y) {
          break;
        }
        this.map[target.x][target.y] = null; // clear old position
        target.move(action.x, action.y);
        this.map[action.x][action.y] = target.pawn;
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

  // debugging utilities
  private collapseMap(map: Array<Array<any>>) {
    // console.log(JSON.stringify(this.collapseMap(this.map)));
    const ret = []
    for (let i  = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j]) {
          ret.push(map[i][j]);
        }
      }
    }
    return ret;
  }

  private debugAction(action: Action) {
    const target = this.sprites.find((s) => s.id == action.id);
    if (target) {
      console.group(`turn: ${turn}`);
      console.log(`action: ${action.action}`);
      console.log(`pawnId: ${action.id}`);
      console.log(`from: ${target.x} ${target.y}`);
      console.log(`to: ${action.x} ${action.y}`);
      console.log(`at target: ${this.map[action.x][action.y]}`)
      console.groupEnd();
    }
  }

  private loadPlayers() {
    // load player's code
    const ai = eval(`(${code})`); // https://stackoverflow.com/a/39299283

    const playerOne = new Player(1, new ai(1));
    const playerTwo = new Player(2, new Random(2));

    return [playerOne, playerTwo];
  }

  private takeTurn(player: Player) {
    const playerAction = player.ai.takeAction(this.map);
    // TODO: validate the action has the right fields
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
        this.growPlants();
      });
    } catch (exception) {
      console.log(exception);
    }
  }
}