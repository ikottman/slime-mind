<script>
  import { hoveredPawnStore } from './store';
</script>

<style>
div {
  padding: 5px;
}
</style>

{#if $hoveredPawnStore.id}
<div>Current Pawn:</div>
<div>ID: {$hoveredPawnStore.id}</div>
<div>Owner: {$hoveredPawnStore.owner}</div>
<div>x,y: {$hoveredPawnStore.x},{$hoveredPawnStore.y}</div>
<div>HP/Max HP: {$hoveredPawnStore.hp}/{$hoveredPawnStore.max_hp}</div>
<div>Level/Max Level: {$hoveredPawnStore.level}/{$hoveredPawnStore.max_level}</div>
  {#if $hoveredPawnStore.type === 'SLIME'}
  <div>Attack: {$hoveredPawnStore.attack}</div>
  {/if}
{:else}
<div>Hover over a pawn to see details</div>
{/if}