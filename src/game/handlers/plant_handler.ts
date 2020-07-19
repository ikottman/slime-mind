import { Map } from '../models/map'
import { GRID_SIZE, configuration } from '../../ui/store';
import { Plant } from "../models/plant";
import { randomInt } from '../utils';

export class PlantHandler {
  map: Map;

  constructor(map: Map) {
    this.map = map;
  }

  // plants have a chance to level
  private levelUp() {
    this.map.plants
      .filter(plant => plant.level < configuration.plant.maxLevel)
      .forEach(plant => {
        if (randomInt(0, 100) < configuration.plant.levelChance) {
          plant.gainLevel();
        }
      });
  }

  // max level plants have a chance to replicate
  private seed() {
    this.map.plants
      .filter(plant => plant.level === configuration.plant.maxLevel)
      .forEach(plant => {
        if (randomInt(0, 100) < configuration.plant.seedChance) {
          const options = this.map.emptyCells(plant);
          if (options.length > 0) {
            const [x, y] = options[randomInt(0, options.length - 1)];
            this.map.move(new Plant(x, y), x, y);
          }
        }
      });
  }

  placeInitialPlants() {
    if (configuration.plant.initialPlants === 0) {
      return;
    }

    let numPlants = 0;
    let tries = 0;
    do {
      tries++
      const x = randomInt(0, GRID_SIZE-1);
      const y = randomInt(0, GRID_SIZE-1);
      if (!this.map.invalidMove(x, y)) {
        this.map.move(new Plant(x, y), x, y);
        numPlants++
      }
    }
    while (tries < 100000 && numPlants < configuration.plant.initialPlants);
  }

  takeTurn() {
    this.levelUp();
    this.seed();
  }
}