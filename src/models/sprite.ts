import * as PIXI from "pixi.js";

export default class Sprite {
  sprite: PIXI.Sprite;
  pixelSize: number;
  x: number;
  y: number;

  constructor(asset: string, pixelSize: number) {
      this.sprite = new PIXI.Sprite(PIXI.Texture.from(asset));
      this.pixelSize = pixelSize;
      this.x = 0;
      this.y = 0;
  }

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.sprite.x = x * this.pixelSize;
    this.sprite.y = y * this.pixelSize;
  }
}