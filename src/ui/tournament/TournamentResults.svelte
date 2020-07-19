<script>
  import { configurationStore } from '../store';
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
</style>

<label class='oneScore' class:winner="{winnerIndex === 0}">You:</label> <data>{$resultsStore[0]}</data>
<label class='twoScore' class:winner="{winnerIndex === 1}">{$configurationStore.selectedAI.displayName}:</label> <data>{$resultsStore[1]}</data>
<label class:winner="{winnerIndex === 2}">Ties:</label> <data>{$resultsStore[2]}</data>