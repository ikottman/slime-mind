<script>
  import { game, defaultConfig, configuration, configurationStore, GRID_SIZE } from '../../store';

  let {initialSlimes, minSplitLevel, splitXpPercentage, splitHpPercentage} = defaultConfig.slime;

  function reset() {
    const slime = {
      initialSlimes,
      minSplitLevel,
      splitXpPercentage,
      splitHpPercentage,
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
  <h4>Slime Configuration</h4>
</div>
<div class='container'>
  <label>Initial Slimes</label>
  <input type=number bind:value={initialSlimes} on:change={reset} min=1 max={GRID_SIZE}>
  <label>Min Level to Split</label>
  <input type=number bind:value={minSplitLevel} on:change={reset} min=1 max=12>
  <label>XP Percentage on Split</label>
  <input type=number bind:value={splitXpPercentage} on:change={reset} min=1 max=100>
  <label>HP Percentage on Split</label>
  <input type=number bind:value={splitHpPercentage} on:change={reset} min=1 max=100>
</div>