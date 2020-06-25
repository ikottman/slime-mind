import { Action } from './models/action';

export enum PAWN_TYPE {
  PLANT = 'PLANT',
  SLIME = 'SLIME'
};

export interface Pawn {
  id: number,
  x: number,
  y: number,
  type: PAWN_TYPE,
  owner?: number,
  hp: number,
  attack?: number,
  json(): any;
}

export enum ACTIONS {
  MOVE = 'MOVE',
  BITE = 'BITE',
  NOTHING = 'NOTHING'
}

export interface AI {
  takeAction(map: Array<Array<Pawn | null>>, id: number): Action;
}