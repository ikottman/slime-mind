import Controls from './ui/Controls.svelte';
import Game from './game/game';
import { TURN } from './game/constants';

// render UI
const controls = new Controls({
  target: document.body,
  props: {
    turn: TURN,
  },
});
export default controls;

const game = new Game();
game.run();