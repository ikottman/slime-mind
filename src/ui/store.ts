import { writable } from 'svelte/store';
import * as PIXI from "pixi.js";
import Game from '../game/game';

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
    code = value
  }
});

// game
export const GRID_SIZE = 25; // number of rows/columns in our grid
export const SPRITE_SIZE =  window.innerHeight / GRID_SIZE; // size each grid box should be
export const APP = new PIXI.Application({
  width:  window.innerHeight, // make square
  height:  window.innerHeight,
  backgroundColor: 0x1099bb,
  autoStart: false
});

export const game = new Game();