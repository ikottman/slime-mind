<script>
  import Navigation from './Navigation.svelte';
</script>

<Navigation let:selected={selected}>
  <svelte:component this={selected}/>
</Navigation>
