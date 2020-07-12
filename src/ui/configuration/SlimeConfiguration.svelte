<script>
  import { game, defaultConfig, configuration, configurationStore, GRID_SIZE } from '../store';

  let {initialSlimes, minSplitLevel} = defaultConfig.slime;

  function reset() {
    const slime = {
      initialSlimes,
      minSplitLevel
    }
    configurationStore.update(configuration => ({...configuration, slime }));
    game.reset();
  }
</script>

<style>
 .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 5px;
  }

  h4 {
    grid-column: 1 / span 2;
    justify-self: end;
    white-space: nowrap;
  }

  label {
    grid-column: 1;
    white-space: nowrap;
  }

  input {
    grid-column-start: 3;
    width: 4em;
    font-size: .7em;
  }
</style>

<div class='container'>
  <h4 class='header'>Slime Configuration</h4>
  <label>Initial Slimes</label>
  <input type=number bind:value={initialSlimes} on:change={reset} min=1 max={GRID_SIZE}>
  <label>Min Level to Split</label>
  <input type=number bind:value={minSplitLevel} on:change={reset} min=1 max=12>
</div>