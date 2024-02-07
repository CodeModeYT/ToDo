<script lang="ts">
	import Textfield from '@smui/textfield';
	import IconButton from '@smui/icon-button';
	// import CharacterCounter from '@smui/textfield/character-counter';
	import { mdiDelete, mdiFormatColorFill, mdiPlus, mdiTrashCan, mdiTrashCanOutline } from '@mdi/js';
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
				id: generateRandomID(),
				task: input
			};
			$tasks = [...$tasks, newTask];
			usrinput = '';
			isTasksEmpty();
		}
	}

	function deleteTask(id: string) {
		$tasks = $tasks.filter((task) => task.id !== id);
	}

	function generateRandomID() {
		let id: string;
		do {
			id = Math.random().toString(16).slice(2).toString();
		} while ($tasks.some((task) => task.id === id));
		return id;
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
		<Icon tag="svg" viewBox="0 0 24 24" class="plusicon">
			<path fill="#FD4864" d={mdiPlus} />
		</Icon>
	</button>
</div>

<div class="active-tasks">
	<p id="task-placeholder">Start writing your first tasks...</p>
	{#each showingtasks as task}
		<div class="eachtask">
			<p class="taskname">{task.task}</p>
			<IconButton class="deletebutton" on:click={() => deleteTask(task.id)}>
				<Icon tag="svg" viewBox="0 0 24 24" class="deleteicon">
					<path fill="#FD4864" d={mdiTrashCanOutline} />
				</Icon>
			</IconButton>
		</div>
	{/each}
</div>
