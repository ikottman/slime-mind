import { code, textHandler, configuration,turn, hoveredPawnId, hoveredPawn, hoveredPawnStore } from '../../ui/store';
import { Map } from '../models/map';
import { Pawn } from '../models/pawn';
import { Slime } from '../models/slime';
import Player from '../models/player';
import { Action } from '../models/action';
import { ACTIONS, PAWN_TYPE } from '../schema';
import { randomInt, isGameOver } from '../utils';

export class AiHandler {
  map: Map;
  playerOne!: Player;
  playerTwo!: Player;

  constructor(map: Map) {
    this.map = map;
    this.loadAis();
  }

  private invalidMove(action: Action, source: Pawn): boolean {
    if (!Number.isInteger(action.x) || !Number.isInteger(action.y)) {
      return true;
    }

    if (this.map.cellOccupied(action.x, action.y)) {
      console.log(`invalid MOVE, target square occupied: ${JSON.stringify(action)}`);
      return true;
    }

    const distance = ((action.x - source.x)**2+(action.y - source.y)**2)**(1/2);
    if (distance > 1){
      console.log(`invalid MOVE, more than one square in a cardinal direction: ${JSON.stringify(action)}`);
      return true
    }

    return false;
  }

  private invalidBite(action: Action, source: Slime, target: Pawn | null): boolean {
    if (!target) {
      return true;
    }

    if (source.x === target.x && source.y === target.y) {
      console.log(`pawn ${target?.id} tried to bite itself`);
      return true;
    }

    const distance = ((action.x - source.x)**2+(action.y - source.y)**2)**(1/2);
    if (distance > 1){
      console.log(`invalid BITE, more than one square in a cardinal direction: ${JSON.stringify(action)}`);
      return true
    }

    return false;
  }

  private invalidAction(action: Action): boolean {
    if (!action || action.id === undefined || action.id === null) {
      console.log(`invalid action, something is null: ${JSON.stringify(action)}`);
      return true;
    }

    return false;
  }

  private attemptMerge(slime: Slime): void {
    const mySlimes = this.map.neighbors(slime).filter(pawn => pawn.owner === slime.owner) as Array<Slime>;
    const mergeableSlimes = mySlimes.filter(slime => slime?.readyToMerge);
    if (mergeableSlimes[0]) {
      const sacrifice = mergeableSlimes[0];
      slime.gainExperience(sacrifice.xp);
      slime.gainHp(slime.maxHp); // set hp to max
      this.map.clearCell(sacrifice.x, sacrifice.y);
      textHandler.addText('MERGE', slime, '#72fa78');
    } else {
      slime.readyToMerge = true;
    }
  }

  private attemptSplit(slime: Slime): void {
    const cells = this.map.emptyCells(slime);
    if (cells.length === 0) {
      console.log(`slime ${slime.id} for player ${slime.owner} attempted to split without any valid cells`);
      return;
    }

    if (slime.level < configuration.slime.minSplitLevel) {
      console.log(`slime ${slime.id} for player ${slime.owner} can't split, it's lower than the minimum split level`);
      return;
    }

    slime.split();
    const targetCell = cells[randomInt(0, cells.length - 1)];
    const child = new Slime(slime.owner, targetCell[0], targetCell[1]);
    // set the child stats based on the split initiator
    child.gainExperience(slime.xp - 1); // -1 to offset the 1 you start with
    child.hp = slime.hp
    this.map.move(child, child.x, child.y);
    textHandler.addText('SPLIT', slime, '#941651');
  }

  private updatePawnStats() {
    if (hoveredPawnId) {
      const pawn = this.map.findById(hoveredPawnId);
      if (pawn) {
        hoveredPawnStore.update(_ => pawn.json());
      }
    } else if (hoveredPawn.id) {
      hoveredPawnStore.update(_ => ({}));
    }
  }

  private executeAction(action: Action, source: Slime): void {
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
        if (this.invalidBite(action, source, target) || !source.attack || !target) {
          return;
        }
        if (target.type === PAWN_TYPE.ROCK){
          const killed = target?.takeDamage(source.attack);
          if (killed) {
            this.map.clearCell(target.x, target.y);
          }
          return;
        }
        const killed = target?.takeDamage(source.attack);
        if (killed) {
          this.map.clearCell(target.x, target.y);
        }
        source.gainExperience(1);
        source.gainHp(1);
        break;
      case ACTIONS.MERGE:
        this.attemptMerge(source as Slime);
        break;
      case ACTIONS.SPLIT:
        this.attemptSplit(source as Slime);
        break;
      default:
        console.log(`skipping invalid action: ${action.action}`);
    }
  }

  private runAi(slime: Slime): void {
    // skip slimes that were eaten or merged away
    const currentCellOccupant = this.map.get(slime.x, slime.y);
    if (currentCellOccupant === null || currentCellOccupant.id !== slime.id || isGameOver(this.map, turn)) {
      return;
    }

    let playerAction;
    try {
      if (slime.owner === 1) {
        playerAction = this.playerOne.ai.takeAction(this.map.readOnlyMap, slime.id,configuration,turn);
      } else {
        playerAction = this.playerTwo.ai.takeAction(this.map.readOnlyMap, slime.id,configuration,turn);
      }
    } catch (exception) {
      console.log(`player ${slime.owner} takeAction errored with: ${exception}`);
      console.log(exception.stack);
      return;
    }

    const action = new Action(slime.id, playerAction.action, playerAction.x, playerAction.y);
    this.executeAction(action, slime);
    this.updatePawnStats();
  }

  // get array alternating each player's slimes
  // leftover slimes are at the end of the array
  private getSlimes(): Array<Slime> {
    const one = this.map.pawns.filter(pawn => pawn.owner === 1);
    const two = this.map.pawns.filter(pawn => pawn.owner === 2);
    let slimes = [];
    const whoGoesFirst = randomInt(1, 2);
    while (one.length > 0 || two.length > 0) {
      if (whoGoesFirst === 1) {
        slimes.push(one.pop());
        slimes.push(two.pop());
      } else {
        slimes.push(two.pop());
        slimes.push(one.pop());
      }
    }

    return slimes.filter(s => s) as Array<Slime>;
  }

  loadAis(): void {
    // load player's code
    try {
      const withoutExport = code.replace("export class", "class"); // make it easier to paste pre-made AI in
      const ai = eval(`(${withoutExport})`); // https://stackoverflow.com/a/39299283
      if (ai) {
        this.playerOne = new Player(1, new ai(1));
        this.playerTwo = new Player(2, new configuration.selectedAI(2));
      }
    } catch (exception) {
      console.log(`can't parse player code, errored with: ${exception}`);
      return;
    }
  }

  takeTurn() {
    const slimes = this.getSlimes();
    slimes.forEach((slime) => this.runAi(slime));
    slimes.forEach((slime) => slime.readyToMerge = false);
  }
}