import rabbitImage from "./assets/rabbit.png";
import plantImage from "./assets/plant.png";
import { Sprite, TYPE } from './models/sprite';
import { APP, GRID_SIZE } from './constants';
document.body.appendChild(APP.view);
// all the sprites on the grid. An empty space is null
const map: Array<Array<Sprite | null>> = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));

function spaceOccupied(x: number, y: number) {
    return map[x][y] != null;
}

function inBounds(x: number, y: number) {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}

function invalidMove(x?: number, y?: number) {
    return x == null || x == undefined || 
           y == null || y == undefined ||
           !inBounds(x, y) ||
           spaceOccupied(x, y);
}

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// return list of all valid empty spaces surrounding a point
// if none returns empty list
function emptySpaces(x: number, y: number) {
    const options = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    return options.filter(pt => !invalidMove(x + pt[0], y + pt[1])).map(pt => [x + pt[0], y + pt[1]]);
}

// random x, y both in range [-1, 1]
function randomMove() {
    const x = randomInt(-1, 1);
    const y = randomInt(-1, 1);
    return [x, y];
  }

// fill first column with sprites
for (let i = 0; i < GRID_SIZE; i++) {
    map[0][i] = new Sprite(rabbitImage, 0, i, TYPE.BUNNY);
}

// attempt to fill 10% of the map with plants
for (let i = 0; i < GRID_SIZE / 10; i ++) {
    const x = randomInt(0, GRID_SIZE);
    const y = randomInt(0, GRID_SIZE);
    if (!invalidMove(x, y)) {
        map[x][y] = new Sprite(plantImage, x, y, TYPE.PLANT);
    }
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
        refreshMap();
    }
}

// occasionally have plants replicate
function growPlant(plant: Sprite, chance = 1) {
    if (randomInt(0, 100) < chance) {
        const options = emptySpaces(plant.x, plant.y);
        if (options.length > 0) {
            const [x, y] = options[randomInt(0, options.length - 1)];
            const newPlant = new Sprite(plantImage, x, y, TYPE.PLANT);
            plants.push(newPlant);
            refreshMap();
        }
    }
}

// update map with latest position of all entities
// this is a simple brute force way to update the map so we don't have to sprinkle map updates everywhere
function refreshMap() {
    // reset
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            map[i][j] = null;
        }
    }
    bunnies.forEach((bunny) => map[bunny.x][bunny.y] = bunny);
    plants.forEach((plant) => map[plant.x][plant.y] = plant);
    // TODO: can we get list of all rendered sprites and calculate their grid point so we don't have to use these lists?
}

// initial sets, these change over time
const sprites: Array<Sprite> = [].concat(...map).filter((s: Sprite | null) => s != null);
const bunnies: Array<Sprite> = sprites.filter((s: Sprite) => s.type == TYPE.BUNNY);
const plants: Array<Sprite> = sprites.filter((s: Sprite) => s.type == TYPE.PLANT);

// game clock
let turn = 0;
APP.ticker.add(() => {
    bunnies.forEach(bunny => moveBunny(bunny));
    plants.forEach(plant => growPlant(plant));

    if (turn > 1000) {
        throw Error();
    }
});
