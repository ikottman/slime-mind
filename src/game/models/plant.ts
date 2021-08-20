import * as PIXI from "pixi.js";
import { PAWN_TYPE } from '../schema';
import { Pawn } from './pawn';
import { configuration } from "../../ui/store";

export class Plant extends Pawn {
  current_hp: number;
  level: number;

  constructor(x: number, y: number) {
    super(-1, x, y);
    this.type = PAWN_TYPE.PLANT;
    this.current_hp = 3;
    this.level = 1;
  }

  get maxHp(): number {
    const hpRatio = 6;
    return hpRatio * this.level;
  }

  // prevent hp from going above max
  set hp(new_hp: number) {
    this.current_hp = Math.min(new_hp, this.maxHp);
  }

  get hp(): number {
    return this.current_hp;
  }

  takeDamage(damage: number) {
    this.hp = this.hp - damage;
    return this.hp <= 0;
  }

  json() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      type: this.type,
      hp: this.hp,
      level: this.level,
      maxLevel: configuration.plant.maxLevel,
      maxHp: this.maxHp,
      owner: this.owner,
    }
  }
}