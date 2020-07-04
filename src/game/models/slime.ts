import * as PIXI from "pixi.js";
import { PAWN_TYPE } from '../schema';
import redSlime from '../assets/red_slime.png';
import blueSlime from '../assets/blue_slime.png';
import { Pawn } from './pawn';

export class Slime extends Pawn {
  hp: number;
  xp: number;
  readyToMerge: boolean;
  max_level: number;

  constructor(owner: number, x: number, y: number) {
    super(owner, x, y);
    this.type = PAWN_TYPE.SLIME;
    this.hp = 10;
    this.readyToMerge = false;
    this.xp = 1;
    this.max_level = 12;

    if (owner === 1) {
      this.addSprite(PIXI.Sprite.from(redSlime));
    } else {
      this.addSprite(PIXI.Sprite.from(blueSlime));
    }
  }

  gainExperience(xp: number) {
    this.xp += xp;
  }

  get level(): number {
    const xpRequired = [
      1,
      2,
      6,
      15,
      33,
      62,
      106,
      169,
      254,
      368,
      513,
      695
    ];
    const level = xpRequired.findIndex(required => required > this.xp);
    return level === -1 ? xpRequired.length : level;
  }

  get attack(): number {
    const attackByLevel = [
      3,
      4,
      7,
      10,
      13,
      16,
      20,
      24,
      29,
      33,
      38,
      43
    ];
    return attackByLevel[this.level - 1];
  }

  get max_hp(): number {
    const hpByLevel = [
      11,
      13,
      18,
      23,
      31,
      40,
      50,
      61,
      75,
      89,
      105,
      122
    ];
    return hpByLevel[this.level - 1];
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
      owner: this.owner,
      xp: this.xp,
      hp: this.hp,
      level: this.level,
      max_level: this.max_level,
      max_hp: this.max_hp,
      attack: this.attack,
    };
  }
}