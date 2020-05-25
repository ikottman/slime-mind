import rabbitImage from "./assets/rabbit.png";
import plantImage from "./assets/plant.png";
import { Sprite, TYPE } from './models/sprite';
import Player from './models/player';
import { Action, ACTIONS } from './models/action';
import { APP, GRID_SIZE } from './constants';
import { inBounds, randomInt } from './utils';
import { turn, turnStore } from '../ui/store';
import Random from './ai/random';
import Pawn from "./models/pawn";

export default class Game {
    // all the sprites on the grid. An empty space is null
    map: Array<Array<Sprite | null>> = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
    bunnies: Array<Sprite>;
    plants: Array<Sprite>;

    constructor() {
        // display the canvas
        document.body.appendChild(APP.view);

        // fill first column with sprites
        for (let i = 0; i < GRID_SIZE; i++) {
            const bunnyPawn = new Pawn(-1, 0, i);
            this.map[0][i] = new Sprite(rabbitImage, bunnyPawn, TYPE.BUNNY);
        }

        // attempt to fill 10% of the map with plants
        for (let i = 0; i < GRID_SIZE / 10; i ++) {
            const x = randomInt(0, GRID_SIZE);
            const y = randomInt(0, GRID_SIZE);
            if (!this.invalidMove(x, y)) {
                const plantPawn = new Pawn(-1, x, y);
                this.map[x][y] = new Sprite(plantImage, plantPawn, TYPE.PLANT);
            }
        }

        // initial sets, these change over time
        // TODO: make the map of pawns instead of sprites, so we can give a copy of it to the AI
        const sprites = [].concat(...this.map).filter((s: Sprite | null) => s != null);
        this.bunnies = sprites.filter((s: Sprite) => s.type == TYPE.BUNNY);
        this.plants = sprites.filter((s: Sprite) => s.type == TYPE.PLANT);
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

    // occasionally have plants replicate
    private growPlant(plant: Sprite, chance = 1) {
        if (randomInt(0, 100) < chance) {
            const options = this.emptySpaces(plant.x(), plant.y());
            if (options.length > 0) {
                const [x, y] = options[randomInt(0, options.length - 1)];
                const plantPawn = new Pawn(-1, x, y);
                const newPlant = new Sprite(plantImage, plantPawn, TYPE.PLANT);
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
        this.bunnies.forEach((bunny) => this.map[bunny.x()][bunny.y()] = bunny);
        this.plants.forEach((plant) => this.map[plant.x()][plant.y()] = plant);
        // TODO: can we get list of all rendered sprites and calculate their grid point so we don't have to use these lists?
    }

    private executeAction(action: Action) {
        switch (action.action) {
            case ACTIONS.MOVE:
                const target = this.bunnies.find((b) => b.id == action.id);
                target?.move(action.x, action.y);
            default:
                console.log(`skipping invalid action: ${action.action}`);
        }
    }

    run() {
        const playerOne = new Player(1, new Random());

        APP.ticker.add(() => {
            turnStore.update(t => t + 1);

            const id = this.bunnies.map(b => b.id)[randomInt(0, this.bunnies.length)];
            this.executeAction(playerOne.ai.takeAction(id));
            
            this.plants.forEach(plant => this.growPlant(plant));

            if (turn >= 500) {
                APP.ticker.stop();
            }
        });
    }
}