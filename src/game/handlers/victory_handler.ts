import { APP, textHandler, scores, winnerStore, configuration } from '../../ui/store';
import { Fireworks } from '../../ui/fireworks';

export class VictoryHandler {
  private fireworks: Fireworks;

  constructor() {
    this.fireworks = new Fireworks();
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