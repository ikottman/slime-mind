<script>
  import { defaultConfig, configurationStore } from './tournament_store';
  import AIDropdown from '../game/configuration/AIDropdown.svelte';

  let {matches} = defaultConfig.tournament;

  function reset() {
    const tournament = {
      matches,
    }
    configurationStore.update(configuration => ({...configuration, tournament }));
  }
</script>

<style>
 .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 5px;
  }

  label {
    grid-column: 1;
    white-space: nowrap;
  }

  input {
    grid-column-start: 2;
    width: 4em;
    font-size: .7em;
  }
</style>

<AIDropdown/>
<div class='container'>
  <label>Number of Matches</label>
  <input type=number bind:value={matches} on:change={reset} min=1 max=1000>
</div>