import { writable } from 'svelte/store';

// win totals
export const resultsStore = writable([0, 0, 0]);
export let results: Array<number>;
resultsStore.subscribe(value => results = value);

// configure the tournament
export const defaultConfig = {
  tournament: {
    matches: 3,
  }
}
export const configurationStore = writable(defaultConfig);
export let configuration;
configurationStore.subscribe(value => configuration = { ...configuration, ...value });