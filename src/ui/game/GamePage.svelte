<script>
  import Stage from './Stage.svelte';
  import Turn from './Turn.svelte';
  import StartButton from './StartButton.svelte';
  import StopButton from './StopButton.svelte';
  import ResetButton from './ResetButton.svelte';
  import Scoreboard from './Scoreboard.svelte';
  import PawnStats from './PawnStats.svelte';
  import Winner from './Winner.svelte';
  import Configuration from './configuration/Configuration.svelte';
</script>

<style>
  .threeColumns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    place-items: start;
    margin-top: -5px;
  }

  .leftColumn {
    grid-row: 1;
    grid-column-start: 1;
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

  .stage {
    grid-row: 1;
    grid-column-start: 2;
  }

  .scoreboard {
    grid-row: 1;
    grid-column-start: 3;
    margin-top: 5px;
    padding-left: 5px;
  }

  .winner {
    z-index: 10;
    grid-row: 1;
    grid-column: 1 / span 3;
    justify-self: center;
    align-self: center;
  }
</style>

<div class='threeColumns'>
  <span class='winner'>
    <Winner/>
  </span>
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
  <div class='stage'>
    <Stage/>
  </div>
  <div class="scoreboard">
    <Turn/>
    <Scoreboard/>
    <br/>
    <PawnStats/>
  </div>
</div>
