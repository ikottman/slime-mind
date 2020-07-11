<script>
  import { hoveredPawnStore } from './store';
</script>

<style>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

label {
  align-self: start;
}

data {
  align-self: end;
}
</style>

{#if $hoveredPawnStore.id}
  <div class='container'>
    <label>ID</label><data>{$hoveredPawnStore.id}</data>
    <label>Owner</label><data>{$hoveredPawnStore.owner}</data>
    <label>x y</label><data>{$hoveredPawnStore.x},{$hoveredPawnStore.y}</data>
    <label>HP</label><data>{$hoveredPawnStore.hp}/{$hoveredPawnStore.maxHp}</data>
    <label>Level</label><data>{$hoveredPawnStore.level}/{$hoveredPawnStore.maxLevel}</data>
    {#if $hoveredPawnStore.type === 'SLIME'}
      <label>Attack</label><data>{$hoveredPawnStore.attack}</data>
    {/if}
  </div>
{:else}
  <div>Hover over a pawn to see details</div>
{/if}