import { bus, map } from '../../ui/store';
import { GRID_SIZE, configuration } from '../../ui/store';
import { Rock } from "../models/rock";
import { BiteEvent, EVENT_KEY, PAWN_TYPE } from '../schema';
import { randomInt } from '../utils';

export class RockHandler {
  constructor() {
    bus.subscribe(EVENT_KEY.RESET, this.placeRocks.bind(this))
    bus.subscribe(EVENT_KEY.BITE, this.bite.bind(this))
  }

  private placeRocks() {
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

  private bite(event: BiteEvent) {
    const { source, target } = event;
    if (target.type === PAWN_TYPE.ROCK) {
      target.hp = target.hp - source.attack;
      if (target.hp <= 0) {
        bus.emit(EVENT_KEY.KILLED, { victim: target });
      }
    }
  }
}