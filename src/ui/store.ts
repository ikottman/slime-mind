import { writable } from 'svelte/store';
import * as PIXI from "pixi.js";
import { Game } from '../game/game';
import { TextHandler } from '../game/handlers/text_handler';
import { Bus } from '../game/handlers/bus';
import { Configuration } from '../game/schema';

// event bus
export const bus = new Bus();

// turn
export const turnStore = writable(0);
export let turn: number;
turnStore.subscribe(value => turn = value);

// player scores
export const scoresStore = writable([0, 0]);
export let scores: Array<number>;
scoresStore.subscribe(value => scores = value);

// TODO: should be able to remove from store and create in game.ts
// which lets us not create it when we are in tournament
// handles rendered text (like SPLIT and MERGE)
export const textHandler = new TextHandler();

// for displaying details of the pawn the mouse is hovering over
export const hoveredPawnStore = writable({});
export let hoveredPawn: any;
hoveredPawnStore.subscribe(value => hoveredPawn = value);

export const hoveredPawnIdStore = writable(0);
export let hoveredPawnId: number;
hoveredPawnIdStore.subscribe(value => hoveredPawnId = value);

// winner
export const winnerStore = writable('');

// don't render when running a tournament
export const tournamentModeStore = writable(false);
export let tournamentMode: boolean;
tournamentModeStore.subscribe(value => tournamentMode = value);

// game
export const canvasSize = window.innerHeight - 25;
export const GRID_SIZE = 25; // number of rows/columns in our grid
export const SPRITE_SIZE =  canvasSize / GRID_SIZE; // size each grid box should be
export const APP = new PIXI.Application({
  width: canvasSize, // make square
  height: canvasSize,
  backgroundColor: 0x668E86,
  autoStart: false,
});
APP.ticker.minFPS = 5;
APP.ticker.maxFPS = 6;
APP.stage.sortableChildren = true;
// configure aspects of the game like plant seed percentage
export const defaultConfig: Configuration = {
  plant: {
    seedChance: 5,
    maxLevel: 12,
    levelChance: 20,
    initialPlants: Math.floor(GRID_SIZE**2 / 10),
  },
  slime: {
    initialSlimes: 5,
    minSplitLevel: 4,
    splitXpPercentage: 25,
    splitHpPercentage: 50,
  },
  rock: {
    initialRocks: 15,
    maxHp: 100,
  }
}
export const configurationStore = writable(defaultConfig);
export let configuration: Configuration;
// @ts-ignore
configurationStore.subscribe(value => configuration = { ...configuration, ...value });

export const game = new Game();