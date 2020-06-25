import { code } from '../../ui/store';
import { Random } from '../ai/random';
import { Map } from '../models/map';
import { Sprite } from '../models/sprite';
import Player from '../models/player';
import { Action } from '../models/action';
import { ACTIONS } from '../schema';

export class AiHandler {
  map: Map;
  playerOne: Player;
  playerTwo: Player;

  constructor(map: Map) {
    this.map = map;
    this.loadAis();
  }

  private invalidMove(action: Action, source: Sprite): boolean {
    if (this.map.cellOccupied(action.x, action.y)) {
      console.log(`invalid MOVE, target square occupied: ${JSON.stringify(action)}`);
      return true;
    }

    if (action.x < source.x - 1 || action.x > source.x + 1 || 
      action.y < source.y - 1 || action.y > source.y + 1) {
      console.log(`invalid MOVE, more than one square away: ${JSON.stringify(action)}`);
      return true;
    }

    return false;
  }

  private invalidBite(action: Action, source: Sprite, target: Sprite | null): boolean {
    if (!target) {
      return true;
    }

    // TODO: make sure target is within a square of the source

    return false;
  }

  private invalidAction(action: Action): boolean {
    if (!action || action.id == undefined || action.id == null || 
      action.x == null || action.x == undefined || 
      action.y == null || action.y == undefined) {
      console.log(`invalid action, something is null: ${JSON.stringify(action)}`);
      return true;
    }

    if (!this.map.inBounds(action.x, action.y)) {
      console.log(`invalid action, out of bounds: ${JSON.stringify(action)}`);
      return true;
    }

    return false;
  }

  private executeAction(action: Action, source: Sprite) {
    if (action?.action === ACTIONS.NOTHING || this.invalidAction(action)) {
      return;
    }
    switch (action.action) {
      case ACTIONS.MOVE:
        if (this.invalidMove(action, source)) {
          return;
        }
        this.map.move(source, action.x, action.y);
        break;
      case ACTIONS.BITE:
        const target = this.map.get(action.x, action.y);
        if (this.invalidBite(action, source, target) || !source.pawn.attack || !target) {
          return;
        }
        const killed = target?.takeDamage(source.pawn.attack);
        if (killed) {
          console.log(`Killed target at ${target.x} ${target.y}`);
          this.map.clearCell(target.x, target.y);
        }
        break;
      default:
        console.log(`skipping invalid action: ${action.action}`);
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

  private runAi(slime: Sprite): void {
    let playerAction;
    try {
      if (slime.owner === 1) {
        playerAction = this.playerOne.ai.takeAction(this.map.readOnlyMap, slime.id);
      } else {
        playerAction = this.playerTwo.ai.takeAction(this.map.readOnlyMap, slime.id);
      }
    } catch (exception) {
      console.log(`player ${slime.owner} takeAction errored with: ${exception}`);
      return;
    }

    const action = new Action(slime.id, playerAction.action, playerAction.x, playerAction.y);
    return this.executeAction(action, slime);
  }

  // get array alternating each player's slimes
  // leftover slimes are at the end of the array
  private getSlimes(): Array<Sprite> {
    const one = this.map.sprites.filter(s => s.owner === 1);
    const two = this.map.sprites.filter(s => s.owner === 2);
    let slimes = [];
    if (one.length < two.length) {
      slimes = one.flatMap((s, i) => [one[i], two[i]]);
      slimes.concat(two.slice(one.length - 1, two.length - 1));
    } else {
      slimes = two.flatMap((s, i) => [two[i], one[i]]);
      slimes.concat(one.slice(two.length - 1, one.length - 1));
    }
    return slimes;
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

  loadAis(): void {
    // load player's code
    const ai = eval(`(${code})`); // https://stackoverflow.com/a/39299283

    this.playerOne = new Player(1, new ai(1));
    this.playerTwo = new Player(2, new Random(2));
  }

  takeTurn() {
    if (this.playerOne && this.playerTwo) {
      const slimes = this.getSlimes();
      slimes.forEach((slime) => this.runAi(slime));
    }
  }
}