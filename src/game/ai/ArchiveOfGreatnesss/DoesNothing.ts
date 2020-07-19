// @ts-nocheck
// author: ikottman
export class DoesNothing {
  static displayName = 'Does Nothing';
  static author = 'Slime Mind';
  constructor(playerId) {
    this.playerId = playerId;
  }

  takeAction() {
    return { action: 'NOTHING' };
  }
}