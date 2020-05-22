import * as PIXI from "pixi.js";
import { SPRITE_SIZE, APP } from "../constants";

export default class Sprite {
  sprite: PIXI.Sprite;
  x = 0;
  y = 0;

  constructor(asset: string, x = 0, y = 0) {
      this.sprite = new PIXI.Sprite(PIXI.Texture.from(asset));
      this.sprite.height = SPRITE_SIZE;
      this.sprite.width = SPRITE_SIZE;
      APP.stage.addChild(this.sprite);
      this.move(x, y);
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.sprite.x = x * SPRITE_SIZE;
    this.sprite.y = y * SPRITE_SIZE;
  }
}