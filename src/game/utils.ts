import { map } from '../ui/store';

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isGameOver(turn: number): boolean {
  if (turn >= 1000) {
    return true;
  }
  const one = map.pawns.filter(pawn => pawn.owner === 1);
  const two = map.pawns.filter(pawn => pawn.owner === 2);
  return one.length === 0 || two.length === 0;
}