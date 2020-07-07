import { writable } from 'svelte/store';
import * as PIXI from "pixi.js";
import { Game } from '../game/game';
import { TextHandler } from '../game/handlers/text_handler'; 

// turn
export const turnStore = writable(0);
export let turn: number;
turnStore.subscribe(value => turn = value);

// code from the editor
export const codeStore = writable(window.localStorage.getItem('ai_code'));
export let code: string;
codeStore.subscribe(value => {
  if (value) {
    window.localStorage.setItem('ai_code', value);
    code = value;
  }
});

// player scores
export const scoresStore = writable([0, 0]);
export let scores: Array<number>;
scoresStore.subscribe(value => scores = value);

// handles rendered text (like SPLIT and MERGE)
export const textHandler = new TextHandler();

// game
const canvasSize = window.innerHeight - 25;
export const GRID_SIZE = 25; // number of rows/columns in our grid
export const SPRITE_SIZE =  canvasSize / GRID_SIZE; // size each grid box should be
export const APP = new PIXI.Application({
  width: canvasSize, // make square
  height: canvasSize,
  backgroundColor: 0x668E86, // 0x778899
  autoStart: false
});

export const game = new Game();