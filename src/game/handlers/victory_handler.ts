import { APP, textHandler, scores, winnerStore, tournamentMode } from '../../ui/store';
import { playerTwo } from '../../stores/player_store';
import { Fireworks } from '../../ui/game/fireworks';

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
      winnerStore.update(_ => `${playerTwo.displayName} Wins`);
      return 2;
    }
    winnerStore.update(_ => 'Tie');
    return 3;
  }

  endGame() {
    // don't show fireworks when doing a tournament
    if (!tournamentMode) {
      APP.ticker.stop();
      textHandler.clearAllTexts();
      this.fireworks.start(this.winner());
    }
  }

  reset() {
    this.fireworks.stop();
  }
}