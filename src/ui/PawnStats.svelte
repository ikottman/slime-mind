<script>
  import { hoveredPawnStore } from './store';
</script>

<style>
span {
  padding: 5px;
}
</style>

<span>Current Pawn: {JSON.stringify($hoveredPawnStore, null, 2)}</span>