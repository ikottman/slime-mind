<script>
  import { game, defaultConfig, configuration, configurationStore } from '../../store';

  let {initialPlants, maxLevel, levelChance, seedChance} = defaultConfig.plant;

  function reset() {
    const plant = {
      initialPlants,
      levelChance,
      seedChance,
      maxLevel,
    }
    configurationStore.update(configuration => ({...configuration, plant }));
    game.reset();
  }
</script>

<style>
 .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 5px;
  }

  .header {
    display: grid;
    justify-content: center;
    align-content: center;
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

<div class='header'>
  <h4>Plant Configuration</h4>
</div>
<div class='container'>
  <label>Initial Plants</label>
  <input type=number bind:value={initialPlants} on:change={reset} min=0 max=100>
  <label>Chance to Seed (%)</label>
  <input type=number bind:value={seedChance} on:change={reset} min=1 max=100>
  <label>Chance to Level (%)</label>
  <input type=number bind:value={levelChance} on:change={reset} min=1 max=100>
  <label>Max Level</label>
  <input type=number bind:value={maxLevel} on:change={reset} min=2 max=12> <!-- min is 2 so the plants can change texture at max -->
</div>