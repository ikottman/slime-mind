// @ts-nocheck
// author: ikottman
export class DoesNothing {
  static displayName = 'Does Nothing';
  constructor(playerId) {
    this.playerId = playerId;
  }

  takeAction() {
    return { action: 'NOTHING' };
  }
}