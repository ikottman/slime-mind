<script>
  import { APP } from './store';

  function handleClick() {
    APP.ticker.start();
  }
</script>

<sl-button type='primary' size='small' on:click={handleClick}>
  <sl-icon slot="prefix" name="play"></sl-icon>
  Start
</sl-button>