import { Action } from './action';
import Pawn from "./pawn";

export interface AI {
  takeAction(map: Array<Array<Pawn | null>>): Action;
}

export default class Player {
  id: number;
  ai: AI;

  constructor(id: number, ai: AI) {
      this.id = id;
      this.ai = ai;
  }
}