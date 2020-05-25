import { AI } from '../models/player';
import { Action, ACTIONS } from '../models/action';
import { GRID_SIZE } from '../constants';
import { randomInt } from '../utils';

export default class Random implements AI {
  playerId: number
  constructor(playerId: number) {
    this.playerId = playerId;
  }

  // random x, y both in range [-1, 1]
  private randomMove() {
    const x = randomInt(-1, 1);
    const y = randomInt(-1, 1);
    return [x, y];
  }

  private findValidMove(pawn: any) {
    // brute force finding a valid move with max attempts
    let x, y;
    let [xDelta, yDelta] = this.randomMove();
    x = pawn.x + xDelta;
    y = pawn.y + yDelta;
    return [x, y];
  }

  takeAction(map: any) {
    const myPawns = [];
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map.length; j++) {
        if (map[i][j]?.owner == this.playerId) {
          myPawns.push(map[i][j]);
        }
      }
    }
  
    const pawn = myPawns[randomInt(0, myPawns.length - 1)];
    const [x, y] = this.findValidMove(pawn);
    const example = new Action(pawn.id, ACTIONS.MOVE, x, y);
    return example
  }
}