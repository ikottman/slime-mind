<script>
  import ai from '../../../game/ai/ArchiveOfGreatnesss/';
  import { game } from '../../store';
  import { playerAI, playerTwoStore } from '../../../stores/player_store';

  let options = [playerAI, ...ai];
  let playerTwo;
  function reloadAI() {
    playerTwoStore.update(() => playerTwo);
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
  <label>Player Two:</label>
  <select bind:value={playerTwo} on:change={reloadAI}>
    {#each options as option}
      <option value={option}>
        {option.displayName}
      </option>
    {/each}
  </select>
</div>