<script>
  import { APP } from './store';
  let fps = 1;
  APP.ticker.minFPS = 10;
  // transform the fps so there's more slow options
  $: APP.ticker.maxFPS = (fps * fps / 60);
</script>

<style>
</style>

slow<input type=range bind:value={fps} min=10 step=0.5 max=60>fast