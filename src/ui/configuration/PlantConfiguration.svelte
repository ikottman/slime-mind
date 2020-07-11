<script>
  import { game, defaultConfig, configuration, configurationStore } from '../store';

  let seedChance = defaultConfig.plant.seedChance;
  let maxLevel = defaultConfig.plant.maxLevel;
  function reset() {
    const plant = {
      seedChance,
      maxLevel
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

  h4 {
    grid-column: 1 / span 2;
    justify-self: center;
  }
</style>

<div class='container'>
  <h4 class='header'>Plant Configuration</h4>
  <label>Seed Chance:</label>
  <input type=number bind:value={seedChance} on:change={reset} min=1 max=100>
  <label>Max Level:</label>
  <input type=number bind:value={maxLevel} on:change={reset} min=2 max=12> <!-- min is 2 so the plants can change texture at max -->
</div>