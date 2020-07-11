<script>
  import AIDropdown from './AIDropdown.svelte';
</script>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    place-items: center;
    margin-top: 5px;
  }
</style>

<div class='grid'>
  <AIDropdown/>
</div>

