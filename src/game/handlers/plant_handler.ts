import { bus, map } from '../../ui/store';
import { GRID_SIZE, configuration } from '../../ui/store';
import { Plant } from "../models/plant";
import { EVENT_KEY } from '../schema';
import { randomInt } from '../utils';

export class PlantHandler {

  constructor() {}

  // plants have a chance to level
  private levelUp() {
    map.plants
      .filter(plant => plant.level < configuration.plant.maxLevel)
      .forEach(plant => {
        if (randomInt(0, 100) < configuration.plant.levelChance) {
          plant.level = plant.level + 1;
          // regain lost HP
          plant.hp = plant.hp + (Math.floor(plant.maxHp / 2));
          // swap out sprite to show we hit max level
          if (plant.level === configuration.plant.maxLevel) {
            bus.emit(EVENT_KEY.MAX_PLANT, { pawn: plant });
          }
        }
      });
  }

  // max level plants have a chance to replicate
  private seed() {
    map.plants
      .filter(plant => plant.level === configuration.plant.maxLevel)
      .forEach(plant => {
        if (randomInt(0, 100) < configuration.plant.seedChance) {
          const options = map.emptyCells(plant);
          if (options.length > 0) {
            const [x, y] = options[randomInt(0, options.length - 1)];
            bus.emit(EVENT_KEY.ADD_PLANT, { pawn: new Plant(x, y) });
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
      if (!map.invalidMove(x, y)) {
        bus.emit(EVENT_KEY.ADD_PLANT, { pawn: new Plant(x, y) });
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