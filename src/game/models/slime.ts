import { PAWN_TYPE, EVENT_KEY } from '../schema';
import { Pawn } from './pawn';
import { configuration, bus } from "../../ui/store";

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

  gainExperience(xp: number) {
    if (this.level >= this.maxLevel) {
      return;
    }

    this.xp += xp;
    this.resetLevel();
  }

  gainHp(hp: number) {
    this.hp = Math.min(this.hp + hp, this.maxHp);
    bus.emit(EVENT_KEY.CHANGE_HP, this);
  }

  takeDamage(damage: number) {
    this.hp = this.hp - damage;
    bus.emit(EVENT_KEY.CHANGE_HP, this);

    if (this.hp <= 0) {
      bus.emit(EVENT_KEY.KILLED, { victim: this });
    }
  }

  split(): void {
    this.xp = Math.max(1, Math.floor(this.xp * (configuration.slime.splitXpPercentage / 100)));
    this.resetLevel();
    this.hp = Math.min(this.maxHp, Math.floor(this.hp * (configuration.slime.splitHpPercentage / 100)));
  }

  private resetLevel() {
    const currentLevel = this.level;
    const currentHpPercentage = this.hp / this.maxHp;

    // sophisticated math
    this.level = Math.floor(1.847 * this.xp**0.286);

    // handle level up or down (down can happen in splits)
    if (this.level > currentLevel) {
      // retain the same ratio of hp
      const hp = Math.ceil(currentHpPercentage * this.maxHp);
      this.gainHp(hp - this.hp);

      if (currentLevel < 10 && this.level === 10){
        bus.emit(EVENT_KEY.KING, this);
      }
    } else if (this.level < currentLevel && this.level < 10) {
      bus.emit(EVENT_KEY.ADD_SLIME, { pawn: this });
    }
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