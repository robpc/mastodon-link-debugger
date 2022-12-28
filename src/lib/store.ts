/**
 * Credit to: https://www.ratamero.com/blog/showing-a-loading-spinner-when-navigation-is-delayed-in-sveltekit
 */

import { derived } from 'svelte/store';
import { navigating } from '$app/stores';

let timer: NodeJS.Timeout;
export const navigationIsDelayed = derived(navigating, (newValue, set) => {
  if (timer) {
    clearTimeout(timer);
  }
  if (newValue) {
    timer = setTimeout(() => set(true), 500);
  }
  set(false);
});
