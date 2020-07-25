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
      // setTimeout, even without a delay, allows other actions to
      // interleave with this loop. This allows the UI to update occasionally
      // without this the browser will ask to kill the script if we run long matches
      // I _think_ this is still in order, so matches run independently of each other
      setTimeout(runMatch);
    } while (++matches < configuration.tournament.matches)
  }
</script>

<style>
</style>

<sl-button type='primary' size='small' on:click={startTournament}>
  <sl-icon slot="prefix" name="play"></sl-icon>
  Start
</sl-button>