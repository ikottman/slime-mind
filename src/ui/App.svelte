<script>
  import Game from './Game.svelte';
  import Turn from './Turn.svelte';
  import Editor from './Editor.svelte';
  import StartButton from './StartButton.svelte';
  import StopButton from './StopButton.svelte';
  import ResetButton from './ResetButton.svelte';
  import FPS from './FPS.svelte';
  import Scoreboard from './Scoreboard.svelte';
</script>

<style>
  .gameGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    grid-gap: 5px;
  }

  .headerGrid {
    display: grid;
    grid-template-columns: repeat(11, 1fr) 30px;
    align-items: end;
  }

  .controls {
    grid-column: 1 / 6;
  }

  .scoreboard {
    grid-column: 9 / 12;
    justify-self: end;
  }
</style>

<div class='headerGrid'>
  <div class='controls'>
    <StartButton/>
    <StopButton/>
    <ResetButton/>
    <FPS/>
  </div>
  <div class="scoreboard">
    <Turn/>
    <Scoreboard/>
  </div>
</div>
<div class='gameGrid'>
  <Editor/>
  <Game/>
</div>