<script>
  import { game, defaultConfig, configuration, configurationStore, GRID_SIZE } from '../../store';

  let { initialRocks, maxHp } = defaultConfig.rock;

  function reset() {
    const rock = {
      initialRocks,
      maxHp
    }
    configurationStore.update(configuration => ({...configuration, rock }));
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
  <h4 class='header'>Rock Configuration</h4>
  <label>Number of Rocks</label>
  <input type=number bind:value={initialRocks} on:change={reset} min=0 max={GRID_SIZE * GRID_SIZE}>
  <label>Initial HP</label>
  <input type=number bind:value={maxHp} on:change={reset} min=1 max=9999>
</div>