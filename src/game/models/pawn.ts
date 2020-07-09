import * as PIXI from "pixi.js";
import { SPRITE_SIZE, APP } from "../../ui/store";
import { PAWN_TYPE } from "../schema";

export class Pawn {
  id: number;
  x: number;
  y: number;
  owner: number;
  // provided by extending classes like Slime
  type!: PAWN_TYPE;
  sprite!: PIXI.Container;

  constructor(owner: number, x: number, y: number) {
    this.id = PIXI.utils.uid();
    this.owner = owner;
    this.x = x;
    this.y = y;
  }
  
  move(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.sprite.x = x * SPRITE_SIZE;
    this.sprite.y = y * SPRITE_SIZE;
  }

  addSprite(sprite: PIXI.Sprite) {
    this.sprite = sprite;
    this.sprite.height = SPRITE_SIZE;
    this.sprite.width = SPRITE_SIZE;
    APP.stage.addChild(this.sprite);
    // update sprite's location
    this.move(this.x, this.y);
  }

  // take damage and return true if this killed the pawn
  takeDamage(damage: number): boolean {
    return false;
  }

  json() {
    throw Error('Classes extending Pawn must implement a json method');
  }
}