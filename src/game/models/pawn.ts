export default class Pawn {
  owner: number;
  x = 0;
  y = 0;

  constructor(owner: number, x = 0, y = 0) {
      this.owner = owner;
      this.x = x;
      this.y = y;
  }
}