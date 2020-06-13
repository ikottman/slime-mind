import { PAWN_TYPE } from '../schema';
import { Map } from '../models/map'
import { GRID_SIZE } from '../../ui/store';
import { Plant } from "../models/pawns/plant";
import { randomInt } from '../utils';

export class PlantHandler {
  map: Map;
  constructor(map: Map) {
    this.map = map;
  }

  // occasionally have plants replicate
  private seedPlants() {
    this.map.sprites
    .filter((s) => s.type === PAWN_TYPE.PLANT)
    .forEach((plant) => {
      if (randomInt(0, 100) < 1) {
        const options = this.map.emptyCells(plant);
        if (options.length > 0) {
          const [x, y] = options[randomInt(0, options.length - 1)];
          this.map.placeNew(new Plant(x, y));
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
        this.map.placeNew(new Plant(x, y));
      }
    }
  }

  takeTurn() {
    this.seedPlants();
  }
}