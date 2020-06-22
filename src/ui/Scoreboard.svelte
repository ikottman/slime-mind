<script>
  import { scoresStore } from './store';
</script>

<style>
.oneScore {
  color: red;
}

.twoScore {
  color: blue;
}
</style>

<lable class='oneScore'>You:</lable> <span>{$scoresStore[0]}</span>
<lable class='twoScore'>Them:</lable> <span>{$scoresStore[1]}</span>