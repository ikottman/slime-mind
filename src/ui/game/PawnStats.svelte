<script>
  import { hoveredPawnStore } from '../store';
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
    {#if $hoveredPawnStore.hp !== undefined}
      <label>HP</label><data>{$hoveredPawnStore.hp}/{$hoveredPawnStore.maxHp}</data>
    {/if}
    {#if $hoveredPawnStore.xp !== undefined}
      <label>XP</label><data>{$hoveredPawnStore.xp}</data>
    {/if}
    {#if $hoveredPawnStore.level !== undefined}
      <label>Level</label><data>{$hoveredPawnStore.level}/{$hoveredPawnStore.maxLevel}</data>
    {/if}
    {#if $hoveredPawnStore.attack !== undefined}
      <label>Attack</label><data>{$hoveredPawnStore.attack}</data>
    {/if}
    {#if $hoveredPawnStore.readyToMerge !== undefined}
      <label>Ready to Merge</label><data>{$hoveredPawnStore.readyToMerge}</data>
    {/if}
  </div>
{:else}
  <div>Hover over a pawn to see details</div>
{/if}