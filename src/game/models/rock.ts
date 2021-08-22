import { PAWN_TYPE } from '../schema';
import { Pawn } from './pawn';
import { configuration } from "../../ui/store";

export class Rock extends Pawn {
  hp: number;
  maxHp: number;

  constructor(x: number, y: number) {
    super(-1, x, y);
    this.type = PAWN_TYPE.ROCK;
    this.hp = configuration.rock.maxHp;
    this.maxHp = configuration.rock.maxHp;
  }

  json() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      type: this.type,
      owner: this.owner,
      hp: this.hp,
      maxHp: this.maxHp,
    }
  }
}