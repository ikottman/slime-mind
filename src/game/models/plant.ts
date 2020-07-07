import * as PIXI from "pixi.js";
import { PAWN_TYPE } from '../schema';
import { Pawn } from './pawn';
import plant from '../assets/plant.png'
import max_level_plant from '../assets/max_level_plant.png'

export class Plant extends Pawn {
  current_hp: number;
  level: number;
  max_level: number;

  constructor(x: number, y: number) {
    super(-1, x, y);
    this.type = PAWN_TYPE.PLANT;
    this.current_hp = 3;
    this.level = 1;
    this.max_level = 12;
    this.addSprite(PIXI.Sprite.from(plant));
  }

  get max_hp(): number {
    const hpRatio = 6;
    return hpRatio * this.level;
  }

  // prevent hp from going above max
  set hp(new_hp: number) {
    this.current_hp = Math.min(new_hp, this.max_hp);
  }

  get hp(): number {
    return this.current_hp;
  }

  gainLevel() {
    this.level = this.level + 1;
    // regain lost HP
    this.hp = this.hp + (Math.floor(this.max_hp / 2));
    // swap out sprite to show we hit max level
    if (this.level === this.max_level) {
      this.sprite.destroy();
      this.addSprite(PIXI.Sprite.from(max_level_plant));
    }
  }

  takeDamage(damage: number) {
    this.hp = this.hp - damage;
    return this.hp <= 0;
  }

  json() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      type: this.type,
      hp: this.hp,
      level: this.level,
      max_level: this.max_level,
      max_hp: this.max_hp,
      owner: this.owner,
    }
  }
}