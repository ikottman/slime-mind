<script>
  import { APP } from './store';
  let fps = 200;
  $: APP.ticker.maxFPS = fps;
</script>

<style>
</style>

slow<input type=range bind:value={fps} min=.5 max=200>fast