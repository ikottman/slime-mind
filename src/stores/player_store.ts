import { writable, derived } from 'svelte/store';
import { ExampleAI } from '../game/ai/ArchiveOfGreatnesss/ExampleAI';
import { DoesNothing } from '../game/ai/ArchiveOfGreatnesss/DoesNothing';
import { readFileSync } from 'fs';

// code from the editor
const defaultCode = window.localStorage.getItem('ai_code') || readFileSync('src/game/ai/starterAI', 'utf8');
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

// opponent AI
export const playerTwoStore = writable(ExampleAI);
export let playerTwo: any;
playerTwoStore.subscribe(value => playerTwo = value);