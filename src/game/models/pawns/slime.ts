import * as PIXI from "pixi.js";
import { PAWN_TYPE, Pawn } from '../../schema';

export class Slime implements Pawn {
  id: number;
  owner: number;
  type = PAWN_TYPE.SLIME;
  x: number;
  y: number;
  hp: number;
  xp: number;
  attack: number;
  readyToMerge: boolean;

  constructor(owner: number, x: number, y: number) {
    this.id = PIXI.utils.uid();
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.hp = 10;
    this.attack = 3;
    this.readyToMerge = false;
    this.xp = 0;
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
      owner: this.owner,
      xp: this.xp
    }
  }
}