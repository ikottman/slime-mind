<script>
  import { APP } from './store';

  function handleClick() {
    APP.ticker.stop();
  }
</script>

<sl-button type='danger' size='small' on:click={handleClick}>
  <sl-icon slot="prefix" name="stop"></sl-icon>
  Pause
</sl-button>