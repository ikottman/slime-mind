import * as PIXI from "pixi.js";
import { PAWN_TYPE, Pawn } from '../../schema';

export class Plant implements Pawn {
  id: number;
  type = PAWN_TYPE.PLANT;
  x: number;
  y: number;
  hp: number;
  xp: number;
  level: number;
  max_level: number;
  owner: number;

  constructor(x: number, y: number) {
    this.id = PIXI.utils.uid();
    this.x = x;
    this.y = y;
    this.hp = 3;
    this.xp = 0;
    this.level = 0;
    this.max_level = 12;
    this.owner = -1;
  }

  gainExperience(xp: number) {
    this.xp += xp;
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
      owner: -1
    }
  }
}