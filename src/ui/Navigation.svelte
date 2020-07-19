<script>
  import { game } from './store';
  import { playerAI, playerOneStore, playerTwoStore } from '../stores/player_store';
  import GamePage from './game/GamePage.svelte';
  import EditorPage from './editor/EditorPage.svelte';
  import TournamentPage from './tournament/TournamentPage.svelte';

  let selected = GamePage;
  let hovered = '';
  function selectCodeTab() {
    game.reset();
    selected = EditorPage;
  }

  function selectGameTab() {
    game.reset();
    selected = GamePage;
  }

  function selectTournamentTab() {
    game.reset();
    selected = TournamentPage;
  }

  function hoverGameTab() {
    hovered = 'GAME';
  }

  function hoverCodeTab() {
    hovered = 'CODE';
  }

  function hoverTournamentTab() {
    hovered = 'TOURNAMENT';
  }

  function unhover() {
    hovered = '';
  }
</script>

<style>
  .hovered {
    background-color: #eeeeee;
    color: #0088ee;
    cursor: pointer;
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
  <span class:hovered="{hovered === 'TOURNAMENT'}" on:click={selectTournamentTab} on:mouseenter={hoverTournamentTab} on:mouseleave={unhover}>Tournament</span>
</div>
<slot selected={selected}></slot>