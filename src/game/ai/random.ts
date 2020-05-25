import { AI } from '../models/player';
import { Action, ACTIONS } from '../models/action';
import { GRID_SIZE } from '../constants';
import { randomInt } from '../utils';

export default class Random implements AI {
  constructor() {}

  // random x, y both in range [-1, 1]
  private randomMove() {
    const x = randomInt(-1, 1);
    const y = randomInt(-1, 1);
    return [x, y];
  }

  takeAction(id: number) {
    const example = new Action(id, ACTIONS.MOVE, randomInt(0, GRID_SIZE-1), randomInt(0, GRID_SIZE-1));
    return example
  }
}

// // brute force finding a valid move with max attempts
// let x, y;
// let tries = 0;
// do {
//     let [xDelta, yDelta] = this.randomMove();
//     x = bunny.x + xDelta;
//     y = bunny.y + yDelta;
//     tries++;
// }
// while (this.invalidMove(x, y) && tries < 10);

// if (!this.invalidMove(x, y)) {
//     bunny.move(x, y);
//     this.refreshMap();
// }