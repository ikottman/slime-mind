import { AI } from '../models/player';
import { Pawn } from '../models/pawn';
import { ACTIONS } from '../models/action';
import { GRID_SIZE } from '../../ui/store';
import { randomInt } from '../utils';

export class Random implements AI {
  playerId: number;
  map: Array<Array<any>> = [];
  constructor(playerId: number) {
    this.playerId = playerId;
  }

  // random x, y both in range [-1, 1]
  private randomMove() {
    const x = randomInt(-1, 1);
    const y = randomInt(-1, 1);
    return [x, y];
  }

  private invalidMove(x: number, y: number) {
    return x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE || this.map[x][y];
  }

  private findValidMove(pawn: Pawn) {
    // brute force finding a valid move with max attempts
    let [x, y] = [pawn.x, pawn.y];
    let tries = 0;
    do {
      let [xDelta, yDelta] = this.randomMove();
      x = pawn.x + xDelta;
      y = pawn.y + yDelta;
      tries++;
    }
    while (this.invalidMove(x, y) && tries < 100);
    return [x, y];
  }

  takeAction(map: Array<Array<Pawn>>) {
    this.map = map;
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
    return {
      id: pawn.id,
      action: ACTIONS.MOVE,
      x,
      y
    }
  }
}