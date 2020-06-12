import * as PIXI from "pixi.js";
import { PAWN_TYPE, Pawn } from '../../schema';

export class Plant implements Pawn {
  id: number;
  type = PAWN_TYPE.PLANT;
  x: number;
  y: number;
  maxHp: number;
  hp: number;
  xp: number;
  lvl: number;
  canSeed: number;

  constructor(x: number, y: number) {
    this.id = PIXI.utils.uid();
    this.x = x;
    this.y = y;
    this.maxHp = 10;
    this.hp = 10;
    this.xp = 0;
    this.lvl = 1;
    this.canSeed = 0;
  }
}