<script>
  import { APP } from './store';
  let fps = 1;
  $: APP.ticker.maxFPS = fps;
</script>

<style>
</style>

slow<input type=range bind:value={fps} min=0.5 step=0.5 max=60>fast