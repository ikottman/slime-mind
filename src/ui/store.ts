import { writable, derived } from 'svelte/store';
import * as PIXI from "pixi.js";
import { Game } from '../game/game';
import { TextHandler } from '../game/handlers/text_handler';
import { Configuration } from '../game/schema';
import { ExampleAI } from '../game/ai/ArchiveOfGreatnesss/ExampleAI';
import { DoesNothing } from '../game/ai/ArchiveOfGreatnesss/DoesNothing';
import { readFileSync } from 'fs';

// turn
export const turnStore = writable(0);
export let turn: number;
turnStore.subscribe(value => turn = value);

const defaultCode = window.localStorage.getItem('ai_code') || readFileSync('src/game/ai/starterAI', 'utf8');
// code from the editor
export const codeStore = writable(defaultCode);
export let code: string;
codeStore.subscribe(value => {
  if (value) {
    window.localStorage.setItem('ai_code', value);
    code = value;
  }
});

// evaluated player code
export const playerAIStore = derived(codeStore, $codeStore => {
  try {
    const withoutExport = $codeStore.replace("export class", "class"); // make it easier to paste pre-made AI in
    const ai = eval(`(${withoutExport})`); // https://stackoverflow.com/a/39299283
    new ai(1); // make sure it has a constructor
    return ai;
  } catch (exception) {
    console.error(`can't parse player code, errored with:\n${exception}`);
    return DoesNothing;
  }
});
export let playerAI: any;
playerAIStore.subscribe(value => playerAI = value);

// player scores
export const scoresStore = writable([0, 0]);
export let scores: Array<number>;
scoresStore.subscribe(value => scores = value);

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
  // @ts-ignore
  selectedAI: ExampleAI,
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