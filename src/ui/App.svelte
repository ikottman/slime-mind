<script>
  import Game from './Game.svelte';
  import Turn from './Turn.svelte';
  import Editor from './Editor.svelte';
</script>

<style>
  .outerGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    grid-gap: 5px;
  }
</style>

<Turn/>
<div class='outerGrid'>
  <Editor/>
  <Game/>
</div>