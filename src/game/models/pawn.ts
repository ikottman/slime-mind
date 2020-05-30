export enum TYPE {
  PLANT= 'PLANT',
  SLIME= 'SLIME'
};

export class Pawn {
  id: number;
  owner: number;
  type: TYPE;
  x = 0;
  y = 0;

  constructor(id: number, owner: number, type: TYPE, x = 0, y = 0) {
    this.id = id;
    this.owner = owner;
    this.type = type;
    this.x = x;
    this.y = y;
  }
}