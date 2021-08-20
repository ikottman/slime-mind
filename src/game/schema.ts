import { Action } from './models/action';
import { Pawn } from './models/pawn';
import { Slime } from './models/slime';

export enum EVENT_KEY {
  // game events
  END_TURN = 'END TURN',
  END_GAME = 'END GAME',
  RESET = 'RESET',
  // slime events
  ADD_SLIME = 'ADD SLIME',
  SPLIT = 'SPLIT',
  MERGE = 'MERGE',
  CHANGE_HP = 'CHANGE HP',
  KING = 'KING',
  MOVE = 'MOVE',
  KILLED = 'KILLED'
}

export interface MergeEvent {
  slime: Slime,
  sacrifice: Slime
}

export interface MoveEvent {
  pawn: Pawn,
  x: number,
  y: number
}

export interface KilledEvent {
  victim: Pawn
}

export enum PAWN_TYPE {
  PLANT = 'PLANT',
  SLIME = 'SLIME',
  ROCK = 'ROCK'
};

export enum ACTIONS {
  MOVE = 'MOVE',
  BITE = 'BITE',
  NOTHING = 'NOTHING',
  MERGE = 'MERGE',
  SPLIT = 'SPLIT',
}

export enum LAYERS {
  BACKGROUND = 0,
  HPBAR = 1,
  PAWN = 2,
  TEXT = 3,
}

export interface AI {
  new(playerId: number): AI;
  constructor(playerId: number): void;
  takeAction(map: Array<Array<Pawn | null>>, id: number, configuration: Configuration,turn: number): Action;
  displayName: string;
}

interface plantConfiguration {
  seedChance: number;
  maxLevel: number;
  levelChance: number;
  initialPlants: number;
}

interface slimeConfiguration {
  initialSlimes: number;
  minSplitLevel: number;
  splitHpPercentage: number;
  splitXpPercentage: number;
}

interface rockConfiguration {
  initialRocks: number;
  maxHp: number;
}

export interface Configuration {
  plant: plantConfiguration;
  slime: slimeConfiguration;
  rock: rockConfiguration;
}