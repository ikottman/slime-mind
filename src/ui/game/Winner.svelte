<script>
  import { winnerStore } from '../store';
  let winner;
  winnerStore.subscribe(value => {
    winner = value;
  });
</script>

<style>
label {
  color: white;
  font-size: 2em;
}
</style>

{#if winner !== ''}
<label>{winner}</label>
{/if}