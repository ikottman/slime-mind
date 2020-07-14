import { APP, turn, textHandler, scores, winnerStore, configuration } from '../../ui/store';
import { Map } from '../models/map';
import { Fireworks } from '../../ui/fireworks';

export class VictoryHandler {
  private map: Map;
  private fireworks: Fireworks;
  
  constructor(map: Map) {
    this.map = map;
    this.fireworks = new Fireworks();
  }

  private playerOutOfPawns(): boolean {
    const one = this.map.pawns.filter(pawn => pawn.owner === 1);
    const two = this.map.pawns.filter(pawn => pawn.owner === 2);
    return one.length === 0 || two.length === 0;
  }

  isGameOver() {
    return turn >= 1000 || this.playerOutOfPawns();
  }

  private winner() {
    if (scores[0] > scores[1]) {
      winnerStore.update(_ => 'You Win');
      return 1;
    } else if (scores[0] < scores[1]) {
      winnerStore.update(_ => `${configuration.selectedAI.displayName} Wins`);
      return 2;
    }
    winnerStore.update(_ => 'Tie');
    return 3;
  }

  endGame() {
    APP.ticker.stop();
    textHandler.clearAllTexts();
    this.fireworks.start(this.winner());
  }

  reset() {
    this.fireworks.stop();
  }
}