import * as PIXI from "pixi.js";
import { PAWN_TYPE, LAYERS } from '../schema';
import redSlime from '../assets/red_slime.png';
import blueSlime from '../assets/blue_slime.png';
import redKing from '../assets/red_king.png';
import blueKing from '../assets/blue_king.png';
import { Pawn } from './pawn';

export class Slime extends Pawn {
  hp: number;
  xp: number;
  readyToMerge: boolean;
  maxLevel: number;

  constructor(owner: number, x: number, y: number) {
    super(owner, x, y);
    this.type = PAWN_TYPE.SLIME;
    this.readyToMerge = false;
    this.xp = 1;
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
    const currentLevel = this.level;
    const currentHpPercentage = this.hp / this.maxHp;
    if (this.level < this.maxLevel) {
      this.xp += xp;
    }

    // set health to the same percentage you had before
    // when the max hp increases
    if (this.level > currentLevel) {
      const hp = Math.ceil(currentHpPercentage * this.maxHp);
      this.gainHp(hp - this.hp);
      //TODO make sprite creation more effcient
      if(this.level >= 2){
        this.sprite.destroy();
        if (this.owner === 1) {
          this.addSprite(PIXI.Sprite.from(redKing));
        } else{
          this.addSprite(PIXI.Sprite.from(blueKing));
        }
      }
    }
  }

  gainHp(hp: number) {
    this.hp = this.hp + hp;
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp;
    }
    this.updateHpBar();
  }

  split(): void {
    this.xp = Math.floor(this.xp / 4);
    //TODO make sprite creation more efficient
    if(this.level < 10){
      this.sprite.destroy();
      if (this.owner === 1){
        this.addSprite(PIXI.Sprite.from(redSlime));
        this.updateHpBar();
      } else{
        this.addSprite(PIXI.Sprite.from(blueSlime));
        this.updateHpBar();
      }
    }
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