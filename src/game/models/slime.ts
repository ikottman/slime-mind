import * as PIXI from "pixi.js";
import { PAWN_TYPE, LAYERS } from '../schema';
import redSlime from '../assets/red_slime.png';
import blueSlime from '../assets/blue_slime.png';
import redKing from '../assets/red_king.png';
import blueKing from '../assets/blue_king.png';
import { Pawn } from './pawn';
import { configuration } from "../../ui/store";

export class Slime extends Pawn {
  hp: number;
  xp: number;
  level: number;
  readyToMerge: boolean;
  maxLevel: number;

  constructor(owner: number, x: number, y: number) {
    super(owner, x, y);
    this.type = PAWN_TYPE.SLIME;
    this.readyToMerge = false;
    this.xp = 1;
    this.level = 1;
    this.maxLevel = 12;
    this.hp = this.maxHp;

    if (owner === 1) {
      this.addSprite(PIXI.Sprite.from(redSlime));
    } else {
      this.addSprite(PIXI.Sprite.from(blueSlime));
    }

    this.updateHpBar();
  }

  private updateHpBar(): void {
    let bar = this.sprite.getChildByName('hpBar') as PIXI.Graphics;
    if (bar) {
      bar.destroy();
    }
    bar = new PIXI.Graphics();
    bar.name = 'hpBar';
    this.sprite.addChild(bar);
    // put the  bar under the pawn
    bar.zIndex = LAYERS.HPBAR;
    this.sprite.sortChildren();
    // render an arc relative to how much health they have left
    bar.lineStyle(3.5, 0x00ff00);
    const halfPi = 3 * Math.PI / 2;
    const hpRatio = this.hp / this.maxHp;
    bar.arc(this.sprite.width / 2, this.sprite.height / 2, this.sprite.width / 1.8, halfPi - Math.PI * hpRatio, halfPi + Math.PI * hpRatio);
  }

  gainExperience(xp: number) {
    if (this.level >= this.maxLevel) {
      return;
    }

    this.xp += xp;
    this.resetLevel();
  }

  gainHp(hp: number) {
    this.hp = Math.min(this.hp + hp, this.maxHp);
    this.updateHpBar();
  }

  split(): void {
    this.xp = Math.max(1, Math.floor(this.xp * (configuration.slime.splitXpPercentage / 100)));
    this.resetLevel();
    this.hp = Math.min(this.maxHp, Math.floor(this.hp * (configuration.slime.splitHpPercentage / 100)));
  }

  private resetLevel() {
    const currentLevel = this.level;
    const currentHpPercentage = this.hp / this.maxHp;

    // sophisticated math
    this.level = Math.floor(1.847 * this.xp**0.286);

    // handle level up or down (down can happen in splits)
    if (this.level > currentLevel) {
      // retain the same ratio of hp
      const hp = Math.ceil(currentHpPercentage * this.maxHp);
      this.gainHp(hp - this.hp);

      // we gained king level
      if (currentLevel < 10 && this.level === 10){
        this.sprite.destroy();
        this.owner === 1 ? this.addSprite(PIXI.Sprite.from(redKing)) : this.addSprite(PIXI.Sprite.from(blueKing));
      }
    } else if (this.level < currentLevel && this.level < 10) {
      // we lost king level
      this.sprite.destroy();
      this.owner === 1 ? this.addSprite(PIXI.Sprite.from(redSlime)) : this.addSprite(PIXI.Sprite.from(blueSlime));
      this.updateHpBar();
    }
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

  get maxHp(): number {
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
    this.updateHpBar();
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
      maxLevel: this.maxLevel,
      maxHp: this.maxHp,
      attack: this.attack,
    };
  }
}