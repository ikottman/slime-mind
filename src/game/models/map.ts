import { Pawn } from '../schema';
import { GRID_SIZE } from '../../ui/store';
import { Sprite } from '../models/sprite';

export class Map {
  // the game map. An empty space is null
  grid: Array<Array< Sprite | null>>;

  constructor() {
    this.grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
  }

  reset() {
    for (let i  = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid.length; j++) {
        this.clearCell(i, j);
      }
    }
  }

  cellOccupied(x: number, y: number): boolean {
    return this.grid[x][y] != null;
  }

  // true if it is valid to move to given cell
  invalidMove(x?: number, y?: number): boolean {
    return x == null || x == undefined || 
        y == null || y == undefined ||
        !this.inBounds(x, y) ||
        this.cellOccupied(x, y);
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
  }

  // return list of all valid empty cells surrounding a pawn
  // if all are occupied, returns empty list
  emptyCells(pawn: Pawn) {
    const x = pawn.x;
    const y = pawn.y;
    const options = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    return options.filter(pt => !this.invalidMove(x + pt[0], y + pt[1])).map(pt => [x + pt[0], y + pt[1]]);
  }

  // list of all occupants of the map
  get sprites(): Array<Sprite> {
    const sprites: Array<Sprite> = [];
    for (let i  = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid.length; j++) {
        const cell = this.grid[i][j];
        if (cell) {
          sprites.push(cell);
        }
      }
    }
    return sprites;
  }

  // TODO: make read only
  get readOnlyMap(): Array<Array<Pawn | null>> {
    const grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
    for (let i  = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid.length; j++) {
        if (this.grid[i][j]) {
          grid[i][j] = this.grid[i][j]?.pawn;
        }
      }
    }
    return grid;
  }

  // create a new map piece
  placeNew(pawn: Pawn): void {
    this.grid[pawn.x][pawn.y] = new Sprite(pawn);
  }

  // remove pawn (if any) from the map
  clearCell(x: number, y: number): void {
    this.grid[x][y]?.sprite.destroy;
    this.grid[x][y] = null;
  }

  // put target in new position, setting previous cell to null
  // does nothing if the target is already at that location
  move(target: Sprite, x: number, y: number): void {
    if (target.x === x && target.y === y) {
      return;
    }
    this.grid[target.x][target.y] = null;
    this.grid[x][y] = target;
    // update pawn and rendered sprite's position
    target.move(x, y);
  }

  // return sprite with given id, or null if it isn't in the map
  findById(id: number): Sprite | null {
    return this.sprites.find((s) => s.id === id) || null;
  }
}