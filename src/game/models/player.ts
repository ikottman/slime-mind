import { Action } from './action';

export interface AI {
  takeAction(id: number): Action;
}

export default class Player {
  id: number;
  ai: AI;

  constructor(id: number, ai: AI) {
      this.id = id;
      this.ai = ai;
  }
}