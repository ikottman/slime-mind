import * as PIXI from "pixi.js";

export const SCREEN_SIZE = window.innerHeight; // max height we can render in
export const GRID_SIZE = 20; // number of rows/columns in our grid
export const SPRITE_SIZE = SCREEN_SIZE / GRID_SIZE; // size each grid box should be
export const APP = new PIXI.Application({
  width: SCREEN_SIZE, // make square
  height: SCREEN_SIZE,
  backgroundColor: 0x1099bb
});