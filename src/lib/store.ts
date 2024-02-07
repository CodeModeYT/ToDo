import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export function useStorage<Value>(key: string, initialValue: Value): Writable<Value> {
	const serialize = JSON.stringify;
	const deserialize = JSON.parse;

	if (!browser) {
		return writable(initialValue);
	}

	const storedValue: Value = deserialize(localStorage.getItem(key) as string);

	const store = writable(storedValue ? storedValue : initialValue);
	store.subscribe((value) => localStorage.setItem(key, serialize(value)));

	return store;
}
