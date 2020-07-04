import { PAWN_TYPE } from '../schema';
import { Map } from '../models/map'
import { GRID_SIZE } from '../../ui/store';
import { Plant } from "../models/plant";
import { randomInt } from '../utils';

export class PlantHandler {
  map: Map;

  constructor(map: Map) {
    this.map = map;
  }

  // plants have a chance to level
  private levelUp() {
    const levelUpChance = 10;
    this.map.plants
      .filter(plant => plant.level < plant.max_level)
      .forEach(plant => {
        if (randomInt(0, 100) < levelUpChance) {
          plant.level = plant.level + 1;
          // regain lost HP
          plant.hp = plant.hp + (Math.floor(plant.max_hp / 2));
        }
      });
  }

  // max level plants have a chance to replicate
  private seed() {
    const seedChance = 1;
    this.map.plants
      .filter(plant => plant.level === plant.max_level)
      .forEach(plant => {
        if (randomInt(0, 100) < seedChance) {
          const options = this.map.emptyCells(plant);
          if (options.length > 0) {
            const [x, y] = options[randomInt(0, options.length - 1)];
            this.map.move(new Plant(x, y), x, y);
          }
        }
      });
  }

  placeInitialPlants() {
    // attempt to fill 10% of the map with plants
    for (let i = 0; i < GRID_SIZE / 10; i ++) {
      const x = randomInt(0, GRID_SIZE);
      const y = randomInt(0, GRID_SIZE);
      if (!this.map.invalidMove(x, y)) {
        this.map.move(new Plant(x, y), x, y);
      }
    }
  }

  takeTurn() {
    this.levelUp();
    this.seed();
  }
}