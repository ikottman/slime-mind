<script>
  import { ExampleAI, SpaceInvaders, RedV1SimpleMove } from '../game/ai/ArchiveOfGreatnesss/';
  import { game, selectedAIStore } from './store';

  const options = [ExampleAI, SpaceInvaders, RedV1SimpleMove];
  let selected;
  function reloadAI() {
    selectedAIStore.update(ai => selected);
    game.reset();
  }
</script>

<style>
</style>

<select bind:value={selected} on:change={reloadAI}>
  {#each options as option}
    <option value={option}>
      {option.name}
    </option>
  {/each}
</select>