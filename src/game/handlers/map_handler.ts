import { bus } from '../../ui/store';
import { map } from '../../ui/store';
import { EVENT_KEY, MergeEvent, MoveEvent, KilledEvent, AddSlime, AddPlant } from '../schema';

export class MapHandler {
  constructor() {
    bus.subscribe(EVENT_KEY.RESET, this.reset.bind(this));
    bus.subscribe(EVENT_KEY.ADD_SLIME, this.place.bind(this));
    bus.subscribe(EVENT_KEY.ADD_PLANT, this.place.bind(this));
    bus.subscribe(EVENT_KEY.ADD_ROCK, this.place.bind(this));
    bus.subscribe(EVENT_KEY.MOVE, this.move.bind(this));
    bus.subscribe(EVENT_KEY.MERGE, this.merge.bind(this));
    bus.subscribe(EVENT_KEY.KILLED, this.killed.bind(this));
  }

  private reset() {
    map.reset();
  }

  private place(event: AddSlime | AddPlant) {
    const { pawn } = event;
    map.set(pawn.x, pawn.y, pawn);
  }

  private move(event: MoveEvent) {
    const { from, to, pawn } = event;
    map.set(from.x, from.y, null);
    map.set(to.x, to.y, pawn);
  }

  private merge(event: MergeEvent) {
    const { sacrifice } = event;
    map.set(sacrifice.x, sacrifice.y, null);
  }

  private killed(event: KilledEvent) {
    const { victim } = event;
    map.set(victim.x, victim.y, null);
  }
}