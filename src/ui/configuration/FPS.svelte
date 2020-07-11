<script>
  import { APP } from '../store';
  let fps = 1;
  APP.ticker.minFPS = 10;
  // transform the fps so there's more slow options
  $: APP.ticker.maxFPS = (fps * fps / 60);
</script>

<style>
.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>

<div class='container'>
  <label>Game Speed:</label>
  <div>
    <input type=range bind:value={fps} min=10 step=0.5 max=60>
  </div>
</div>