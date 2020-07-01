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
  xp: number,
  attack?: number,
  readyToMerge?: boolean,
  json(): any
  gainExperience(xp: number): void;
}

export enum ACTIONS {
  MOVE = 'MOVE',
  BITE = 'BITE',
  NOTHING = 'NOTHING',
  MERGE = 'MERGE',
  SPLIT = 'SPLIT',
}

export interface AI {
  takeAction(map: Array<Array<Pawn | null>>, id: number): Action;
}