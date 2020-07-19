<script>
  import { tournamentModeStore, game, scores } from '../store';
  import { configuration, results, resultsStore} from './tournament_store';

  function updateMatchResults() {
    let [oneMatches, twoMatches, ties] = results;
    if (scores[0] > scores[1]) {
      oneMatches++;
    } else if (scores[0] < scores [1]) {
      twoMatches++;
    } else {
      ties++;
    }
    resultsStore.update(() => [oneMatches, twoMatches, ties]);
  }

  function runMatch() {
    game.reset();
    let gameIsOver = false;
    while (!gameIsOver) {
      gameIsOver = game.gameLoop();
    };
    updateMatchResults();
  }

  function startTournament() {
    tournamentModeStore.update(() => true);

    let matches = 0;
    do {
      // time between matches for other browser stuff to run
      setTimeout(runMatch, 1000);
    } while (++matches < configuration.tournament.matches)

    tournamentModeStore.update(() => false);
  }
</script>

<style>
</style>

<sl-button type='primary' size='small' on:click={startTournament}>
  <sl-icon slot="prefix" name="play"></sl-icon>
  Start
</sl-button>