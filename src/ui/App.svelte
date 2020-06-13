<script>
  import Game from './Game.svelte';
  import Turn from './Turn.svelte';
  import Editor from './Editor.svelte';
  import StartButton from './StartButton.svelte';
  import StopButton from './StopButton.svelte';
  import ResetButton from './ResetButton.svelte';
  import FPS from './FPS.svelte';
</script>

<style>
  .outerGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    grid-gap: 5px;
  }
</style>

<Turn/>
<StartButton/>
<StopButton/>
<ResetButton/>
<FPS/>
<br/>
<div class='outerGrid'>
  <Editor/>
  <Game/>
</div>