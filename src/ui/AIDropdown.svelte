<script>
  import { ExampleAI, SpaceInvaders, RedV1SimpleMove } from '../game/ai/ArchiveOfGreatnesss/';
  import { game, configuration, configurationStore } from './store';

  const options = [ExampleAI, SpaceInvaders, RedV1SimpleMove];
  let selectedAI;
  function reloadAI() {
    configurationStore.update(configuration => ({...configuration, selectedAI }));
    game.reset();
  }
</script>

<style>
</style>

<select bind:value={selectedAI} on:change={reloadAI}>
  {#each options as option}
    <option value={option}>
      {option.displayName}
    </option>
  {/each}
</select>