import { bus } from '../../ui/store';
import { map } from '../../ui/store';
import { Pawn } from "../models/pawn";
import { EVENT_KEY, MergeEvent, MoveEvent } from '../schema';

export class MapHandler {
  constructor() {
    bus.subscribe(EVENT_KEY.ADD_SLIME, this.place.bind(this));
    bus.subscribe(EVENT_KEY.MOVE, this.move.bind(this));
    bus.subscribe(EVENT_KEY.MERGE, this.merge.bind(this));
  }

  private place(pawn: Pawn) {
    map.set(pawn.x, pawn.y, pawn);
  }

  private move(event: MoveEvent) {
    const { x, y, pawn } = event;
    map.set(x, y, pawn);
    map.set(pawn.x, pawn.y, null);
  }

  private merge(event: MergeEvent) {
    const { sacrifice } = event;
    map.set(sacrifice.x, sacrifice.y, null);
  }
}