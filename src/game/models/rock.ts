import * as PIXI from "pixi.js";
import { PAWN_TYPE } from '../schema';
import { Pawn } from './pawn';
import rock from '../assets/rock.png'
import { configuration } from "../../ui/store";

export class Rock extends Pawn {

  constructor(x: number, y: number) {
    super(-1, x, y);
    this.type = PAWN_TYPE.ROCK;
    this.addSprite(PIXI.Sprite.from(rock));
  }

  json() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      type: this.type,
      owner: this.owner,
    }
  }
}