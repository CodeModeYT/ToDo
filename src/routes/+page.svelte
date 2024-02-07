<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let valueC = '';

	let tasks = writable<string[]>([]);

	function addTask() {
		const input = (document.getElementById('taskname') as HTMLInputElement).value.trim();
		if (input !== '') {
			tasks.update((currentTasks: any) => [...currentTasks, input]);
			(document.getElementById('taskname') as HTMLInputElement).value = '';
			isTasksEmpty();
			let string = JSON.stringify($tasks);
			localStorage.setItem('todos', string);
		}
	}

	function handleEnterKey(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			addTask();
		}
	}

	function isTasksEmpty() {
		let tasksArray = $tasks;
		if (tasksArray.length !== 0) {
			(document.getElementById('task-placeholder') as HTMLInputElement).style.display = 'none';
		}
	}
</script>

<input
	type="text"
	id="taskname"
	placeholder="Enter the name of the task..."
	maxlength="100"
	on:keydown={handleEnterKey}
/>
<button id="input_button" on:click={addTask}>Add task!</button>
<p id="task-placeholder">Start writing your first tasks...</p>
<div class="task">
	{#each $tasks as task, i}
		<p>{task}</p>
	{/each}
</div>
