import * as PIXI from "pixi.js";
import { SPRITE_SIZE, APP } from "../../ui/store";
import { Pawn, PAWN_TYPE } from '../schema';
import redSlime from '../assets/red_slime.png'
import blueSlime from '../assets/blue_slime.png'
import plant from '../assets/plant.png'

export class Sprite {
  sprite: PIXI.Sprite;
  pawn: Pawn;

  constructor(pawn: Pawn) {
    switch (pawn.type) {
      case PAWN_TYPE.PLANT:
        this.sprite = PIXI.Sprite.from(plant); // TODO: is this inefficient? do we need a cache?
        break;
      case PAWN_TYPE.SLIME:
        if (pawn.owner === 1) {
          this.sprite = PIXI.Sprite.from(redSlime);
        } else {
          this.sprite = PIXI.Sprite.from(blueSlime);
        }
        break;
    }

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

  // take damage and return true if this killed the sprite
  takeDamage(damage: number): boolean {
    this.pawn.hp = this.pawn.hp - damage;
    return this.pawn.hp <= 0;
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

  get owner() {
    return this.pawn.owner;
  }
}