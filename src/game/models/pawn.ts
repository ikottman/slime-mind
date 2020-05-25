export default class Pawn {
  id: number;
  owner: number;
  x = 0;
  y = 0;

  constructor(owner: number, id:number, x = 0, y = 0) {
    this.id = id;
    this.owner = owner;
    this.x = x;
    this.y = y;
  }
}