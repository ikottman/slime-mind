import * as PIXI from "pixi.js";
import { SPRITE_SIZE, APP } from "../constants";
import Pawn from '../models/pawn';

export enum TYPE {
  PLANT= 'PLANT',
  BUNNY= 'BUNNY'
};
export class Sprite {
  id = PIXI.utils.uid();
  sprite: PIXI.Sprite;
  type: TYPE;
  pawn: Pawn;

  constructor(asset: string, pawn: Pawn, type: TYPE) {
      this.sprite = PIXI.Sprite.from(asset);
      this.type = type;
      this.sprite.height = SPRITE_SIZE;
      this.sprite.width = SPRITE_SIZE;
      APP.stage.addChild(this.sprite);
      this.pawn = pawn;
      this.move(pawn.x, pawn.y);
  }

  move(x: number, y: number) {
    //console.log(`${this.type} ${this.id} moving from ${this.x},${this.y} to ${x},${y}`);
    this.pawn.x = x;
    this.pawn.y = y;
    this.sprite.x = x * SPRITE_SIZE;
    this.sprite.y = y * SPRITE_SIZE;
  }

  x() {
    return this.sprite.x / SPRITE_SIZE;
  }

  y() {
    return this.sprite.y / SPRITE_SIZE;
  }
}