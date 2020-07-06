<script>
  let selected = 'GAME';
  function selectCodeTab() {
    selected = 'CODE';
  }
  function selectGameTab() {
    selected = 'GAME';
  }
</script>

<style>
 .active {
   text-decoration: underline;
 }
</style>

<span class:active="{selected ==='GAME'}" on:click={selectGameTab}>Game</span>
<span class:active="{selected ==='CODE'}" on:click={selectCodeTab}>Code</span>
<slot selected={selected}></slot>