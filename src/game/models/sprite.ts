import * as PIXI from "pixi.js";
import { SPRITE_SIZE, APP } from "../../ui/store";
import { Pawn } from '../models/pawn';

export class Sprite {
  sprite: PIXI.Sprite;
  pawn: Pawn;

  constructor(asset: string, pawn: Pawn) {
    this.sprite = PIXI.Sprite.from(asset);
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

  get x() {
    return this.pawn.x;
  }

  get y() {
    return this.pawn.y
  }

  get type() {
    return this.pawn.type;
  }

  get id() {
    return this.pawn.id;
  }
}