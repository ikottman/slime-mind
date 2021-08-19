import { configuration, GRID_SIZE, bus } from '../../ui/store';
import { Map } from '../models/map';
import { Slime} from "../models/slime";
import { EVENT_KEY, MergeEvent } from '../schema';
import { randomInt } from '../utils';

export class SlimeHandler {
  map: Map;

  constructor(map: Map) {
    this.map = map;
    bus.subscribe(EVENT_KEY.RESET, this.placeSlimes.bind(this));
    bus.subscribe(EVENT_KEY.MERGE, this.merge.bind(this));
  }

  private addSlime(x: number, y: number, owner: number) {
    const slime = new Slime(owner, x, y);
    this.map.move(slime, x, y);
  }

  private placeSlimes() {
    let tries = 0;
    let numSlimes = 0;

    do {
      tries++
      const y = randomInt(0, GRID_SIZE-1);
      if (!this.map.invalidMove(0, y) && !this.map.invalidMove(GRID_SIZE - 1, y)) {
        this.addSlime(0, y, 1);
        this.addSlime(GRID_SIZE-1, y, 2);
        numSlimes++
      }
    }
    while (tries < 100000 && numSlimes < configuration.slime.initialSlimes);
  }

  private merge(event: MergeEvent) {
    const { slime, sacrifice } = event;
    slime.gainExperience(sacrifice.xp);
    slime.gainHp(slime.maxHp); // set hp to max
  }
}