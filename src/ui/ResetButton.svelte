<script>
  import { game } from './store';

  function reset() {
    game.reset();
  }
</script>

<sl-button type='info' size='small' on:click={reset}>
  <sl-icon slot="prefix" name="arrow-counterclockwise"></sl-icon>
  Reset
</sl-button>