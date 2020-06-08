import redSlimeImage from "./assets/red_slime.png";
import plantImage from "./assets/plant.png";
import { Sprite } from './models/sprite';
import Player from './models/player';
import { Action, ACTIONS } from './models/action';
import { inBounds, randomInt } from './utils';
import { turn, turnStore, APP, GRID_SIZE, code } from '../ui/store';
import { Pawn, TYPE } from "./models/pawn";
import * as PIXI from "pixi.js";

export default class Game {
  // all the sprites on the grid. An empty space is null
  map: Array<Array<Pawn | null>> = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
  sprites: Array<Sprite> = [];

  constructor() {
    // fill first column with sprites
    for (let i = 0; i < GRID_SIZE; i++) {
      const slime = new Pawn(PIXI.utils.uid(), 1, TYPE.SLIME, 0, i); // TODO: assign owners
      this.sprites.push(new Sprite(redSlimeImage, slime));
      this.map[0][i] = slime;
    }

    // attempt to fill 10% of the map with plants
    for (let i = 0; i < GRID_SIZE / 10; i ++) {
      const x = randomInt(0, GRID_SIZE);
      const y = randomInt(0, GRID_SIZE);
      if (!this.invalidMove(x, y)) {
        const plant = new Pawn(PIXI.utils.uid(), -1, TYPE.PLANT, x, y);
        this.sprites.push(new Sprite(plantImage, plant));
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
    .filter((s) => s.type == TYPE.PLANT)
    .forEach((plant) => {
      if (randomInt(0, 100) < 1) {
        const options = this.emptySpaces(plant.x, plant.y);
        if (options.length > 0) {
          const [x, y] = options[randomInt(0, options.length - 1)];
          const plant = new Pawn(PIXI.utils.uid(), -1, TYPE.PLANT, x, y);
          this.map[x][y] = plant;
          this.sprites.push(new Sprite(plantImage, plant));
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
    if (this.invalidAction(action, playerId)) {
      return;
    }
    switch (action.action) {
      case ACTIONS.MOVE:
        const target = this.sprites.find((s) => s.id == action.id);
        if (target) {
          this.map[target.x][target.y] = null; // clear old position
          target?.move(action.x, action.y);
          this.map[action.x][action.x] = target.pawn;
        } else {
          console.log(`Target missing. skipping invalid action: ${JSON.stringify(action)}`);
        }
        break;
      default:
        console.log(`skipping invalid action: ${action.action}`);
    }
  }

  run() {
    try {
      const ai = eval(`(${code})`); // https://stackoverflow.com/a/39299283
      const playerOne = new Player(1, new ai(1));
      APP.ticker.add(() => {
        turnStore.update(t => t + 1);
        this.executeAction(playerOne.ai.takeAction(this.map), playerOne.id);
        
        this.growPlants();
  
        if (turn >= 100) {
          APP.ticker.stop();
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}