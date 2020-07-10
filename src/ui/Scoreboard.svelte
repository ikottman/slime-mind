<script>
  import { scoresStore, selectedAIStore } from './store';
</script>

<style>
.oneScore {
  color: red;
}

.twoScore {
  color: blue;
}

lable {
  padding: 5px;
}
</style>

<br/>
<lable class='oneScore'>You:</lable> <span>{$scoresStore[0]}</span>
<br/>
<lable class='twoScore'>{$selectedAIStore.displayName}:</lable> <span>{$scoresStore[1]}</span>