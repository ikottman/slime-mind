import * as PIXI from "pixi.js";
import { PAWN_TYPE, LAYERS, EVENT_KEY, AddSlimeEvent, ChangeHpEvent } from '../schema';
import redSlime from '../assets/red_slime.png';
import blueSlime from '../assets/blue_slime.png';
import redKing from '../assets/red_king.png';
import blueKing from '../assets/blue_king.png';
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

    const event: AddSlimeEvent = {
      owner: owner,
      x,
      y,
      id: this.id
    }
    bus.emit(EVENT_KEY.ADD_SLIME, event);

    this.emitChangeHpEvent();
  }

  private emitChangeHpEvent() {
    const event: ChangeHpEvent = {
      id: this.id,
      ratio: this.hp / this.maxHp
    }
    bus.emit(EVENT_KEY.CHANGE_HP, event);
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
    this.emitChangeHpEvent();
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

      // we gained king level
      if (currentLevel < 10 && this.level === 10){
        this.sprite.destroy();
        this.owner === 1 ? this.addSprite(PIXI.Sprite.from(redKing)) : this.addSprite(PIXI.Sprite.from(blueKing));
      }
    } else if (this.level < currentLevel && this.level < 10) {
      // we lost king level
      this.sprite.destroy();
      this.owner === 1 ? this.addSprite(PIXI.Sprite.from(redSlime)) : this.addSprite(PIXI.Sprite.from(blueSlime));
      this.emitChangeHpEvent();
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

  takeDamage(damage: number) {
    this.hp = this.hp - damage;
    this.emitChangeHpEvent();
    return this.hp <= 0;
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