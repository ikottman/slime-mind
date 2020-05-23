import rabbitImage from "./assets/rabbit.png";
import Sprite from './models/sprite';
import { APP, GRID_SIZE } from './constants';
document.body.appendChild(APP.view);
// all the sprites on the grid. An empty space is null
const map: Array<Array<Sprite>> = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));

function spaceOccupied(x: number, y: number) {
    return map[x][y] != null;
}

function inBounds(x: number, y: number) {
    return x > 0 && x < GRID_SIZE && y > 0 && y < GRID_SIZE;
}

function invalidMove(x?: number, y?: number) {
    return x == null || x == undefined || 
           y == null || y == undefined ||
           !inBounds(x, y) ||
           spaceOccupied(x, y);
}

// random x, y both in range [-1, 1]
function randomMove() {
    const x = Math.floor(Math.random() * 3) - 1;
    const y = Math.floor(Math.random() * 3) - 1;
    return [x, y];
  }

// fill first column with sprites
for (let i = 0; i < GRID_SIZE; i++) {
    map[0][i] = new Sprite(rabbitImage, 0, i);
}

// make random valid moves
function moveBunny(bunny: Sprite) {
    // brute force finding a valid move with max attempts
    let x, y;
    let tries = 0;
    do {
        let [xDelta, yDelta] = randomMove();
        x = bunny.x + xDelta;
        y = bunny.y + yDelta;
        tries++;
    }
    while (invalidMove(x, y) && tries < 10);

    if (!invalidMove(x, y)) {
        bunny.move(x, y);
    }
}

const bunnies: Array<Sprite> = [].concat(...map).filter((s: Sprite | null) => s != null);
// game clock
let turn = 0;
APP.ticker.add(() => {
    bunnies.forEach(bunny => moveBunny(bunny));
    console.log(++turn);
    if (turn > 1000) {
        throw Error();
    }
});
