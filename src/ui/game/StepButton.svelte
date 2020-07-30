<script>
  import { APP, tournamentModeStore } from '../store';

  function handleClick() {
    tournamentModeStore.update(() => false);
    APP.ticker.update(performance.now());
  }
</script>

<sl-button type='default' size='small' on:click={handleClick}>
  <sl-icon slot="prefix" name="arrow-right-short"></sl-icon>
  Step
</sl-button>