import * as PIXI from "pixi.js";
import { PAWN_TYPE, Pawn } from '../../schema';

export class Plant implements Pawn {
  id: number;
  type = PAWN_TYPE.PLANT;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.id = PIXI.utils.uid();
    this.x = x;
    this.y = y;
  }

  json() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      type: this.type,
      owner: -1
    }
  }
}