<script>
  import { APP } from './store';
  import { onMount } from 'svelte';

  let view;
  onMount(() => {
    view.appendChild(APP.view);
  });

</script>

<style>
</style>

<div bind:this={view}></div>