<script>
  import { APP, tournamentModeStore } from '../store';

  function handleClick() {
    tournamentModeStore.update(() => false);
    APP.ticker.start();
  }
</script>

<sl-button type='primary' size='small' on:click={handleClick}>
  <sl-icon slot="prefix" name="play"></sl-icon>
  Start
</sl-button>