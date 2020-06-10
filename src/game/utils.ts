import { GRID_SIZE } from '../ui/store';

export function inBounds(x: number, y: number) {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}