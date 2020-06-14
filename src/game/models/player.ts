import { Action } from './action';
import { Pawn } from "../schema";

export interface AI {
  takeAction(map: Array<Array<Pawn | null>>, id: number): Action;
}

export default class Player {
  id: number;
  ai: AI;

  constructor(id: number, ai: AI) {
      this.id = id;
      this.ai = ai;
  }
}