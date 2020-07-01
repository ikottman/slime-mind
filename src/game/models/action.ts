import { ACTIONS } from '../schema';

export class Action {
  id?: number;
  x = 0;
  y = 0;
  action: ACTIONS;

  constructor(id: number, action: ACTIONS, x: number, y: number) {
    this.id = id;
    this.action = action;
    this.x = x;
    this.y = y;
  }
}