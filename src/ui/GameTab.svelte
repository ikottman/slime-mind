<script>
  import Game from './Game.svelte';
  import Turn from './Turn.svelte';
  import StartButton from './StartButton.svelte';
  import StopButton from './StopButton.svelte';
  import ResetButton from './ResetButton.svelte';
  import FPS from './FPS.svelte';
  import Scoreboard from './Scoreboard.svelte';
</script>

<style>
  .gameGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    place-items: start;
  }

  .controlGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    place-items: center;
  }
</style>

<div class='gameGrid'>
  <div class='controlGrid'>
    <StartButton/>
    <StopButton/>
    <ResetButton/>
    <FPS/>
  </div>
  <Game/>
  <div class="scoreboard">
    <Turn/>
    <Scoreboard/>
  </div>
</div>

