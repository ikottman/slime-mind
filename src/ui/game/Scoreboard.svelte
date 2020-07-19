<script>
  import { scoresStore } from '../store';
  import { playerTwoStore } from '../../stores/player_store';
</script>

<style>
.oneScore {
  color: #e80000;
}

.twoScore {
  color: #00838f;
}
</style>

<br/>
<label class='oneScore'>You:</label> <data>{$scoresStore[0]}</data>
<br/>
<label class='twoScore'>{$playerTwoStore.displayName}:</label> <data>{$scoresStore[1]}</data>