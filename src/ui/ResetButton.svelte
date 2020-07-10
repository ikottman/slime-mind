<script>
  import { game } from './store';
  
  function reset() {
    game.reset();
  }
</script>

<style>
  button {
    display: inline-block;
    padding: 0.3em 1.2em;
    margin: 0 0.1em 0.1em 0;
    border: 0.16em solid rgba(255,255,255,0);
    border-radius: 2em;
    font-weight: 300;
    font-size: .6em;
    text-shadow: 0 0.04em 0.04em grey;
    text-align: center;
    transition: all 0.2s;
    background-color: #961EE1;
  }

  button:hover{
   border-color: black;
  }
</style>

<button on:click={reset}>
Reset
</button>