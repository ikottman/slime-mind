<script>
  import { APP } from './store';
  let fps = 1;
  // transform the fps so there's more slow options
  $: APP.ticker.maxFPS = (fps * fps / 60);
</script>

<style>
</style>

slow<input type=range bind:value={fps} min=25 step=0.5 max=60>fast