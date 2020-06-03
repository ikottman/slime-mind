
import { writable } from 'svelte/store';

export const turnStore = writable(0);
export let turn: number;
turnStore.subscribe(value => turn = value);

export const codeStore = writable('');
export let code: string;
codeStore.subscribe(value => {
  if (value) {
    window.localStorage.setItem('ai_code', value);
  }
  code = value
});