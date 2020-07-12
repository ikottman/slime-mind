<script>
  import Game from './Game.svelte';
  import Turn from './Turn.svelte';
  import StartButton from './StartButton.svelte';
  import StopButton from './StopButton.svelte';
  import ResetButton from './ResetButton.svelte';
  import Scoreboard from './Scoreboard.svelte';
  import PawnStats from './PawnStats.svelte';
  import Configuration from './configuration/Configuration.svelte';
</script>

<style>
  .threeColumns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    place-items: start;
    margin-top: -5px;
  }

  .leftColumn {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    place-items: center;
    padding: 5px;
  }

  .controls {
    grid-column: 1 / span 3;
  }

  .configuration {
    grid-column: 1 / span 3;
  }

  .scoreboard {
    margin-top: 5px;
    padding-left: 5px;
  }
</style>

<div class='threeColumns'>
  <div class='leftColumn'>
    <div class='controls'>
      <StartButton/>
      <StopButton/>
      <ResetButton/>
    </div>
    <div class='configuration'>
      <Configuration/>
    </div>
  </div>
  <Game/>
  <div class="scoreboard">
    <Turn/>
    <Scoreboard/>
    <br/>
    <PawnStats/>
  </div>
</div>

