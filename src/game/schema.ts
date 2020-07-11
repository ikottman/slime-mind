import { Action } from './models/action';
import { Pawn } from './models/pawn';

export enum PAWN_TYPE {
  PLANT = 'PLANT',
  SLIME = 'SLIME'
};

export enum ACTIONS {
  MOVE = 'MOVE',
  BITE = 'BITE',
  NOTHING = 'NOTHING',
  MERGE = 'MERGE',
  SPLIT = 'SPLIT',
}

export interface AI {
  new(playerId: number): AI;
  constructor(playerId: number): void;
  takeAction(map: Array<Array<Pawn | null>>, id: number): Action;
  displayName: string;
}

export interface Configuration {
  selectedAI: AI;
}