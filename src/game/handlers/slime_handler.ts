import { configuration, GRID_SIZE, bus } from '../../ui/store';
import { map } from '../../ui/store';
import { Slime} from "../models/slime";
import { BiteEvent, EVENT_KEY, MergeEvent, MoveEvent, PAWN_TYPE, SplitEvent } from '../schema';
import { randomInt } from '../utils';

export class SlimeHandler {

  constructor() {
    bus.subscribe(EVENT_KEY.RESET, this.placeSlimes.bind(this));
    bus.subscribe(EVENT_KEY.MERGE, this.merge.bind(this));
    bus.subscribe(EVENT_KEY.SPLIT, this.split.bind(this));
    bus.subscribe(EVENT_KEY.BITE, this.bite.bind(this));
    bus.subscribe(EVENT_KEY.MOVE, this.move.bind(this));
  }

  private addSlime(x: number, y: number, owner: number) {
    new Slime(owner, x, y); // TODO: move the event out of the constructor
  }

  private resetLevel(slime: Slime) {
    const currentLevel = slime.level;
    const currentHpPercentage = slime.hp / slime.maxHp;

    // sophisticated math
    slime.level = Math.floor(1.847 * slime.xp**0.286);

    // handle level up or down (down can happen in splits)
    if (slime.level > currentLevel) {
      // retain the same ratio of hp
      this.setHp(slime, Math.ceil(currentHpPercentage * slime.maxHp));

      if (currentLevel < 10 && slime.level === 10) {
        bus.emit(EVENT_KEY.KING, this);
      }
    } else if (slime.level < currentLevel && slime.level < 10) {
      // we went down a level
      bus.emit(EVENT_KEY.ADD_SLIME, { pawn: slime });
    }
  }

  private gainExperience(slime: Slime, xp: number) {
    if (slime.level >= slime.maxLevel) {
      return;
    }

    slime.xp += xp;
    this.resetLevel(slime);
  }

  private placeSlimes() {
    let tries = 0;
    let numSlimes = 0;

    do {
      tries++
      const y = randomInt(0, GRID_SIZE-1);
      if (!map.invalidMove(0, y) && !map.invalidMove(GRID_SIZE - 1, y)) {
        this.addSlime(0, y, 1);
        this.addSlime(GRID_SIZE-1, y, 2);
        numSlimes++
      }
    }
    while (tries < 100000 && numSlimes < configuration.slime.initialSlimes);
  }

  private setHp(slime: Slime, hp: number) {
    slime.hp = Math.min(hp, slime.maxHp);
    bus.emit(EVENT_KEY.CHANGE_HP, slime);
  }

  private merge(event: MergeEvent) {
    const { slime, sacrifice } = event;
    this.gainExperience(slime, sacrifice.xp);
    this.setHp(slime, slime.maxHp);
  }

  private split(event: SplitEvent) {
    const { slime } = event;
    // to make splitting not OP, it comes at a cost to xp and hp
    slime.xp = Math.max(1, Math.floor(slime.xp * (configuration.slime.splitXpPercentage / 100)));
    this.resetLevel(slime);
    this.setHp(slime, Math.min(slime.maxHp, Math.floor(slime.hp * (configuration.slime.splitHpPercentage / 100))));

    // create new slime
    const cells = map.emptyCells(slime);
    const targetCell = cells[randomInt(0, cells.length - 1)];
    const child = new Slime(slime.owner, targetCell[0], targetCell[1]);
    // set the child stats based on the split initiator
    child.xp = 0
    this.gainExperience(child, slime.xp);
    this.setHp(child, slime.hp);
  }

  private bite(event: BiteEvent) {
    const { source, target } = event;

    // only gain things if the target is alive
    if (target.type !== PAWN_TYPE.ROCK) {
      this.gainExperience(source, 1);
      this.setHp(source, source.hp + 1);
    }

    // damage slime
    if (target.type === PAWN_TYPE.SLIME) {
      target.hp = target.hp - source.attack;
      if (target.hp <= 0) {
        bus.emit(EVENT_KEY.KILLED, { victim: target });
      }
    }
  }

  private move(event: MoveEvent) {
    const { pawn, from, to } = event;
    pawn.x = to.x;
    pawn.y = to.y;
  }
}