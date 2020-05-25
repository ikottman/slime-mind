
import { writable } from 'svelte/store';

export const turnStore = writable(0);
export let turn: number;
turnStore.subscribe(value => turn = value);