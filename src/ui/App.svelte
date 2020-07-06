<script>
  import Navigation from './Navigation.svelte';
  import GameTab from './GameTab.svelte';
  import Editor from './Editor.svelte';
</script>

<style>
  .editor {
    display: grid;
    place-items: center;
  }
</style>

<Navigation let:selected={selected}>
  {#if selected === 'GAME'}
    <GameTab/>
  {:else if selected === 'CODE'}
    <div class="editor">
      <Editor/>
    </div>
  {/if}
</Navigation>

