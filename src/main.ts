import rabbitImage from "./assets/rabbit.png";
import Sprite from './models/sprite';
import { APP, GRID_SIZE } from './constants';
document.body.appendChild(APP.view);

// create row of bunnies for stress testing
const bunnies: Array<Sprite> = [];
for (let i = 0; i < GRID_SIZE; i++) {
    bunnies.push(new Sprite(rabbitImage, 0, i));
}

// move back and forth
let flip = false;
function moveBunny(bunny: Sprite) {
    
    if (bunny.x == GRID_SIZE) {
        flip = true;
    } else if (bunny.x == 0) {
        flip = false;
    }
    if (bunny.x > 0 && flip ) {
        bunny.move(bunny.x - 1, bunny.y);
    } else if (bunny.x < GRID_SIZE) {
        bunny.move(bunny.x + 1, bunny.y);
    }
}

// game clock
APP.ticker.add(() => {
    bunnies.forEach(bunny => moveBunny(bunny));
});
