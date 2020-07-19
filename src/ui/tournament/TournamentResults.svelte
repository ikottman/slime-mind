<script>
  import { playerOneStore, playerTwoStore } from '../../stores/player_store';
  import { resultsStore } from './tournament_store';

  $: winnerIndex = $resultsStore.every(r => r === 0) ? -1 : $resultsStore.indexOf(Math.max(...$resultsStore));
</script>

<style>
.oneScore {
  color: #e80000;
}

.twoScore {
  color: #00838f;
}

.winner {
  font-weight: bold;
}

div {
  display: grid;
  grid-template-columns: 350px 1em;
  grid-gap: 5px;
}
</style>

<div>
<label class='oneScore' class:winner="{winnerIndex === 0}">{$playerOneStore.displayName}:</label> <data>{$resultsStore[0]}</data>
<label class='twoScore' class:winner="{winnerIndex === 1}">{$playerTwoStore.displayName}:</label> <data>{$resultsStore[1]}</data>
<label class:winner="{winnerIndex === 2}">Ties:</label> <data>{$resultsStore[2]}</data>
</div>