import { Map } from '../models/map'
import { GRID_SIZE, configuration } from '../../ui/store';
import { Rock } from "../models/rock";
import { randomInt } from '../utils';

export class RockHandler {
  map: Map;

  constructor(map: Map) {
    this.map = map;
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
      if (!this.map.invalidMove(x, y)) {
        this.map.move(new Rock(x, y), x, y);
        numRocks++
      }
    }
    while (tries < 100000 && numRocks < configuration.rock.initialRocks);
  }
}