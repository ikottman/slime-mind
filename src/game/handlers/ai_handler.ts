import { code } from '../../ui/store';
import { Random } from '../ai/random';
import { Map } from '../models/map';
import Player from '../models/player';
import { Action, ACTIONS } from '../models/action';

export class AiHandler {
  map: Map;
  playerOne: Player | null = null;
  playerTwo: Player | null = null;

  constructor(map: Map) {
    this.map = map;
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

  private playerTurn(player: Player) {
    let playerAction;
    try {
      playerAction = player.ai.takeAction(this.map.readOnlyMap);
    } catch (exception) {
      console.log(`player ${player.id} takeAction errored with: ${exception}`);
      return;
    }

    const action = new Action(playerAction.id, playerAction.action, playerAction.x, playerAction.y);
    return this.executeAction(action, player.id);;
  }

  loadAis(): void {
    // load player's code
    const ai = eval(`(${code})`); // https://stackoverflow.com/a/39299283

    this.playerOne = new Player(1, new ai(1));
    this.playerTwo = new Player(2, new Random(2));
  }

  takeTurn() {
    if (this.playerOne && this.playerTwo) {
      this.playerTurn(this.playerOne);
      this.playerTurn(this.playerTwo);
    }
  }
}