import Turn from './ui/Turn.svelte';
import Game from './game/game';

const game = new Game();
game.run();

// render UI
const turn = new Turn({target: document.body});
export default turn;