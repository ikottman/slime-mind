import { bus, map } from '../../ui/store';
import { GRID_SIZE, configuration } from '../../ui/store';
import { Rock } from "../models/rock";
import { EVENT_KEY } from '../schema';
import { randomInt } from '../utils';

export class RockHandler {
  constructor() {
  }

  placeRocks() {
    if (configuration.rock.initialRocks === 0) {
      return;
    }

    let numRocks = 0;
    let tries = 0;
    do {
      tries++
      const x = randomInt(0, GRID_SIZE-1);
      const y = randomInt(0, GRID_SIZE-1);
      if (!map.invalidMove(x, y)) {
        bus.emit(EVENT_KEY.ADD_ROCK, { pawn: new Rock(x, y) });
        numRocks++
      }
    }
    while (tries < 100000 && numRocks < configuration.rock.initialRocks);
  }
}