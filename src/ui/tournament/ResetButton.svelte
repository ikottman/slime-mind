<script>
  import { game } from '../store';
  import { resultsStore} from './tournament_store';

  function reset() {
    game.reset();
    resultsStore.update(() => [0, 0, 0]);
  }
</script>

<style>
</style>

<sl-button type='info' size='small' on:click={reset}>
  <sl-icon slot="prefix" name="arrow-counterclockwise"></sl-icon>
  Reset
</sl-button>