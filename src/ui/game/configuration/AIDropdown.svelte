<script>
  import ai from '../../../game/ai/ArchiveOfGreatnesss/';
  import { game } from '../../store';
  import { playerOne, playerTwo, playerAI, playerOneStore, playerTwoStore } from '../../../stores/player_store';

  let selectedPlayerOne;
  let selectedPlayerTwo;
  let options = [playerAI, ...ai];
  function reloadAI() {
    playerOneStore.update(() => selectedPlayerOne);
    playerTwoStore.update(() => selectedPlayerTwo);
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
  <label>Player One:</label>
  <select bind:value={selectedPlayerOne} on:change={reloadAI}>
    {#each options as option}
      <option value={option} selected={option === playerOne}>
        {option.displayName}
      </option>
    {/each}
  </select>
</div>

<div class='container'>
  <label>Player Two:</label>
  <select bind:value={selectedPlayerTwo} on:change={reloadAI}>
    {#each options as option}
      <option value={option} selected={option === playerTwo}>
        {option.displayName}
      </option>
    {/each}
  </select>
</div>