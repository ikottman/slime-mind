export enum ACTIONS {
  MOVE= 'MOVE'
};

export class Action {
  id: number;
  x = 0;
  y = 0;
  action: ACTION;

  constructor(id: number, action: ACTION, x: number, y: number) {
      this.id = id;
      this.action = action;
      this.x = x;
      this.y = y;
  }
}