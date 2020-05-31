import App from './ui/App.svelte';
import Game from './game/game';

// start the game
const game = new Game();
game.run();

// render UI
const app = new App({
  target: document.body
});

export default app;