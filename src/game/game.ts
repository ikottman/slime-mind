import rabbitImage from "./assets/rabbit.png";
import plantImage from "./assets/plant.png";
import { Sprite, TYPE } from './models/sprite';
import { APP, GRID_SIZE, TURN } from './constants';
import { inBounds, randomInt } from './utils';

export default class Game {
    // all the sprites on the grid. An empty space is null
    map: Array<Array<Sprite | null>> = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
    sprites: Array<Sprite>;
    bunnies: Array<Sprite>;
    plants: Array<Sprite>;

    constructor() {
        // display the canvas
        document.body.appendChild(APP.view);

        // fill first column with sprites
        for (let i = 0; i < GRID_SIZE; i++) {
            this.map[0][i] = new Sprite(rabbitImage, 0, i, TYPE.BUNNY);
        }

        // attempt to fill 10% of the map with plants
        for (let i = 0; i < GRID_SIZE / 10; i ++) {
            const x = randomInt(0, GRID_SIZE);
            const y = randomInt(0, GRID_SIZE);
            if (!this.invalidMove(x, y)) {
                this.map[x][y] = new Sprite(plantImage, x, y, TYPE.PLANT);
            }
        }

        // initial sets, these change over time
        this.sprites = [].concat(...this.map).filter((s: Sprite | null) => s != null);
        this.bunnies = this.sprites.filter((s: Sprite) => s.type == TYPE.BUNNY);
        this.plants = this.sprites.filter((s: Sprite) => s.type == TYPE.PLANT);
    }

    private spaceOccupied(x: number, y: number) {
        return this.map[x][y] != null;
    }
    
    private invalidMove(x?: number, y?: number) {
        return x == null || x == undefined || 
               y == null || y == undefined ||
               !inBounds(x, y) ||
               this.spaceOccupied(x, y);
    }

    // return list of all valid empty spaces surrounding a point
    // if none returns empty list
    private emptySpaces(x: number, y: number) {
        const options = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        return options.filter(pt => !this.invalidMove(x + pt[0], y + pt[1])).map(pt => [x + pt[0], y + pt[1]]);
    }

    // random x, y both in range [-1, 1]
    private randomMove() {
        const x = randomInt(-1, 1);
        const y = randomInt(-1, 1);
        return [x, y];
    }

    // make random valid moves
    private moveBunny(bunny: Sprite) {
        // brute force finding a valid move with max attempts
        let x, y;
        let tries = 0;
        do {
            let [xDelta, yDelta] = this.randomMove();
            x = bunny.x + xDelta;
            y = bunny.y + yDelta;
            tries++;
        }
        while (this.invalidMove(x, y) && tries < 10);

        if (!this.invalidMove(x, y)) {
            bunny.move(x, y);
            this.refreshMap();
        }
    }

    // occasionally have plants replicate
    private growPlant(plant: Sprite, chance = 1) {
        if (randomInt(0, 100) < chance) {
            const options = this.emptySpaces(plant.x, plant.y);
            if (options.length > 0) {
                const [x, y] = options[randomInt(0, options.length - 1)];
                const newPlant = new Sprite(plantImage, x, y, TYPE.PLANT);
                this.plants.push(newPlant);
                this.refreshMap();
            }
        }
    }

    // update map with latest position of all entities
    // this is a simple brute force way to update the map so we don't have to sprinkle map updates everywhere
    private refreshMap() {
        // reset
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                this.map[i][j] = null;
            }
        }
        this.bunnies.forEach((bunny) => this.map[bunny.x][bunny.y] = bunny);
        this.plants.forEach((plant) => this.map[plant.x][plant.y] = plant);
        // TODO: can we get list of all rendered sprites and calculate their grid point so we don't have to use these lists?
    }
  
    run() {
        // TODO: manually call render so we can simulate without painting to screen https://pixijs.download/dev/docs/PIXI.Ticker.html#.shared
        APP.ticker.add(() => {
            TURN++;
            this.bunnies.forEach(bunny => this.moveBunny(bunny));
            this.plants.forEach(plant => this.growPlant(plant));

            if (TURN > 1000) {
                APP.ticker.stop();
            }
        });
    }
}