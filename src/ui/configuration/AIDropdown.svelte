<script>
  import { ExampleAI, SpaceInvaders, BelligerentAndNumerous } from '../../game/ai/ArchiveOfGreatnesss/';
  import { game, configuration, configurationStore } from '../store';

  const options = [ExampleAI, SpaceInvaders, BelligerentAndNumerous];
  let selectedAI;
  function reloadAI() {
    configurationStore.update(configuration => ({...configuration, selectedAI }));
    game.reset();
  }
</script>

<style>
.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

select {
  font-size: .7em;
}
</style>

<div class='container'>
  <label>Opponent:</label>
  <select bind:value={selectedAI} on:change={reloadAI}>
    {#each options as option}
      <option value={option}>
        {option.displayName}
      </option>
    {/each}
  </select>
</div>