import * as PIXI from "pixi.js";
import { PAWN_TYPE, Pawn } from '../../schema';

export class Slime implements Pawn {
  id: number;
  owner: number;
  type = PAWN_TYPE.SLIME;
  x: number;
  y: number;

  constructor(owner: number, x: number, y: number) {
    this.id = PIXI.utils.uid();
    this.owner = owner;
    this.x = x;
    this.y = y;
  }

  json() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      type: this.type,
      owner: this.owner
    }
  }
}