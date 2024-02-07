<script lang="ts">
	import Textfield from '@smui/textfield';
	// import CharacterCounter from '@smui/textfield/character-counter';
	import { mdiPlus } from '@mdi/js';
	import Fab, { Icon } from '@smui/fab';
	import { useStorage } from '$lib/store';
	import type { ITask } from '$lib/taskType';

	let usrinput = '';

	const tasks = useStorage<ITask[]>('todos', []);
	$: showingtasks = $tasks;

	function addTask() {
		const input = usrinput.trim();
		if (input !== '') {
			let newTask: ITask = {
				task: input
			};
			$tasks = [...$tasks, newTask];
			usrinput = '';
			isTasksEmpty();
		}
	}

	function handleEnterKey(event: KeyboardEvent | CustomEvent) {
		const keyboardEvent = event as KeyboardEvent;
		if (keyboardEvent.key === 'Enter') {
			addTask();
		}
	}

	function isTasksEmpty() {
		let tasksArray = $tasks;
		if (tasksArray.length !== 0) {
			(document.getElementById('task-placeholder') as HTMLInputElement).style.display = 'none';
		}
	}

	function handleEnterKeyOnTextfield(event: KeyboardEvent | CustomEvent) {
		const keyboardEvent = event as KeyboardEvent;
		if (keyboardEvent.key === 'Enter') {
			addTask();
		}
	}
</script>

<div class="inputdiv">
	<Textfield
		variant="outlined"
		bind:value={usrinput}
		label="Enter the name of the task..."
		input$maxlength={100}
		on:keydown={handleEnterKeyOnTextfield}
		class="inputfield"
	>
		<!-- <CharacterCounter class="ccounter" slot="helper">0 / 100</CharacterCounter> -->
	</Textfield>
	<button id="input_button" class="button" on:click={addTask}>
		<Icon tag="svg" viewBox="0 0 24 24" class="icon">
			<path fill="#FD4864" d={mdiPlus} />
		</Icon>
	</button>
</div>

<div class="active-tasks">
	<p id="task-placeholder">Start writing your first tasks...</p>
	{#each showingtasks as task}
		<p>{task}</p>
	{/each}
</div>
