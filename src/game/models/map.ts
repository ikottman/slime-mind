import { GRID_SIZE } from '../../ui/store';
import { Pawn } from './pawn';
import { Plant } from './plant';
import { Slime } from './slime';
import { PAWN_TYPE } from '../schema';

export class Map {
  // the game map. An empty space is null
  private grid!: Array<Array< Pawn | null>>;

  constructor() {
    this.reset();
  }

  reset() {
    this.grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
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
    return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
  }

  // return list of all valid empty cells surrounding a pawn
  // if all are occupied, returns empty list
  emptyCells(pawn: Pawn) {
    const x = pawn.x;
    const y = pawn.y;
    const options = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    return options.filter(pt => !this.invalidMove(x + pt[0], y + pt[1])).map(pt => [x + pt[0], y + pt[1]]);
  }

  // return list of all pawns surrounding a pawn
  // if all cells are empty, returns empty list
  neighbors(pawn: Pawn): Array<Pawn> {
    const x = pawn.x;
    const y = pawn.y;
    const options = [[x - 1, y - 1], [x -1, y], [x - 1, y + 1], [x, y - 1], [x, y + 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]];
    return options
      .filter(pt => this.inBounds(pt[0], pt[1]))
      .map(pt => this.grid[pt[0]][pt[1]])
      .filter(pawn => pawn !== null) as Array<Pawn>;
  }

  // list of all occupants of the map
  get pawns(): Array<Pawn> {
    const pawns: Array<Pawn> = [];
    for (let i  = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid.length; j++) {
        const cell = this.grid[i][j];
        if (cell) {
          pawns.push(cell);
        }
      }
    }
    return pawns;
  }

  get readOnlyMap(): Array<Array<Pawn | null>> {
    const grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
    for (let i  = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid.length; j++) {
        if (this.grid[i][j]) {
          grid[i][j] = this.grid[i][j]?.json();
        }
      }
    }
    return grid;
  }

  get plants(): Array<Plant> {
    return this.pawns.filter(p => p.type === PAWN_TYPE.PLANT) as Array<Plant>;
  }

  get slimes(): Array<Slime> {
    return this.pawns.filter(p => p.type === PAWN_TYPE.SLIME) as Array<Slime>;
  }

  // return pawn with given id, or null if it isn't in the map
  findById(id: number): Pawn | null {
    return this.pawns.find((s) => s.id === id) || null;
  }

  // get occupant at coordinates. Returns null if out of bounds.
  get(x: number, y: number): Pawn | null {
    if (!this.inBounds(x, y)) {
      return null;
    }
    return this.grid[x][y];
  }

  set(x: number, y: number, pawn: Pawn | null) {
    this.grid[x][y] = pawn;
  }
}