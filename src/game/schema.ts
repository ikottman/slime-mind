export enum PAWN_TYPE {
  PLANT = 'PLANT',
  SLIME = 'SLIME'
};

export interface Pawn {
  id: number,
  x: number,
  y: number,
  type: PAWN_TYPE,
  owner?: number
}