import * as PIXI from "pixi.js";
import { PAWN_TYPE, Pawn } from '../../schema';

export class Slime implements Pawn {
  id: number;
  owner: number;
  type = PAWN_TYPE.SLIME;
  x: number;
  y: number;
  maxHp: number;
  hp: number;
  atk: number;
  xp: number;
  lvl: number;
  mergeReady: number;
  spare1: number;
  spare2: number;
  spare3: number;

  constructor(owner: number, x: number, y: number) {
    this.id = PIXI.utils.uid();
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.maxHp = 10;
    this.hp = 10;
    this.atk = 1;
    this.xp = 0;
    this.lvl = 1;
    this.mergeReady = 0;
    this.spare1 = 0;
    this.spare2 = 0;
    this.spare3 = 0;
  }
}