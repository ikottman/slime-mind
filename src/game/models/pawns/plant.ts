import * as PIXI from "pixi.js";
import { PAWN_TYPE, Pawn } from '../../schema';

export class Plant implements Pawn {
  id: number;
  type = PAWN_TYPE.PLANT;
  x: number;
  y: number;
  current_hp: number;
  level: number;
  max_level: number;
  owner: number;

  constructor(x: number, y: number) {
    this.id = PIXI.utils.uid();
    this.x = x;
    this.y = y;
    this.current_hp = 3;
    this.level = 1;
    this.max_level = 12;
    this.owner = -1;
  }

  get max_hp(): number {
    const hpRatio = 6;
    return hpRatio * this.level;
  }

  // prevent hp from going above max
  set hp(new_hp: number) {
    this.current_hp = Math.min(new_hp, this.max_hp);
  }

  get hp(): number {
    return this.current_hp;
  }

  json() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      type: this.type,
      hp: this.hp,
      level: this.level,
      max_level: this.max_level,
      max_hp: this.max_hp,
      owner: -1
    }
  }
}