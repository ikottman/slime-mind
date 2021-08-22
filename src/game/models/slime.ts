import { PAWN_TYPE, EVENT_KEY } from '../schema';
import { Pawn } from './pawn';
import { bus } from "../../ui/store";

export class Slime extends Pawn {
  hp: number;
  xp: number;
  level: number;
  readyToMerge: boolean;
  maxLevel: number;

  constructor(owner: number, x: number, y: number) {
    super(owner, x, y);
    this.type = PAWN_TYPE.SLIME;
    this.readyToMerge = false;
    this.xp = 1;
    this.level = 1;
    this.maxLevel = 12;
    this.hp = this.maxHp;

    bus.emit(EVENT_KEY.ADD_SLIME, { pawn: this });
  }

  get attack(): number {
    const attackByLevel = [
      3,
      4,
      7,
      10,
      13,
      16,
      20,
      24,
      29,
      33,
      38,
      43
    ];
    return attackByLevel[this.level - 1];
  }

  get maxHp(): number {
    const hpByLevel = [
      11,
      13,
      18,
      23,
      31,
      40,
      50,
      61,
      75,
      89,
      105,
      122
    ];
    return hpByLevel[this.level - 1];
  }

  json() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      type: this.type,
      owner: this.owner,
      xp: this.xp,
      hp: this.hp,
      level: this.level,
      maxLevel: this.maxLevel,
      maxHp: this.maxHp,
      attack: this.attack,
    };
  }
}