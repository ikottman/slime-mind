<script>
  import { tournamentModeStore, game } from '../store';
  import StartButton from './StartButton.svelte';
  import ResetButton from './ResetButton.svelte';
  import Configuration from './Configuration.svelte';
  import TournamentResults from './TournamentResults.svelte';

</script>

<style>
  .container {
    display: grid;
    grid-gap: 10px;
    place-items: center;
  }

  .buttons {
  }

  .configuration {
  }

  .results {
  }

</style>

<div class='container'>
  <div class='buttons'>
    <StartButton/>
    <ResetButton/>
  </div>
  <div class='configuration'>
    <Configuration/>
  </div>
  <div class='results'>
    <TournamentResults/>
  </div>
</div>