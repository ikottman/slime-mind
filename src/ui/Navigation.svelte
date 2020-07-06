<script>
  let selected = 'GAME';
  let hovered = '';
  function selectCodeTab() {
    selected = 'CODE';
  }

  function selectGameTab() {
    selected = 'GAME';
  }

  function hoverGameTab() {
    hovered = 'GAME';
  }

  function hoverCodeTab() {
    hovered = 'CODE';
  }
  
  function unhover() {
    hovered = '';
  }
</script>

<style>
  .hovered {
    background-color: #eeeeee;
    color: #0088ee;
  }

  div {
    background-color: rgba(0,0,0,.4);
    margin-bottom: 5px;
  }

  span {
    transition: color .3s, background-color .3s;
    color: white;
    padding-right: 15px;
    padding-left: 15px;
  }
</style>

<div>
  <span class:hovered="{hovered === 'GAME'}" on:click={selectGameTab} on:mouseenter={hoverGameTab} on:mouseleave={unhover}>Game</span>
  <span class:hovered="{hovered === 'CODE'}" on:click={selectCodeTab} on:mouseenter={hoverCodeTab} on:mouseleave={unhover}>Code</span>
</div>
<slot selected={selected}></slot>