<script lang="ts">
	import Textfield from '@smui/textfield';
	import IconButton from '@smui/icon-button';
	// import CharacterCounter from '@smui/textfield/character-counter';
	import {
		mdiDelete,
		mdiFormatColorFill,
		mdiPencilOutline,
		mdiPlus,
		mdiTableStar,
		mdiTrashCan,
		mdiTrashCanOutline
	} from '@mdi/js';
	import Fab, { Icon } from '@smui/fab';
	import { useStorage } from '$lib/store';
	import type { ITask } from '$lib/taskType';
	import Checkbox from '@smui/checkbox';

	let usrinput = '';
	let checked = false;

	const tasks = useStorage<ITask[]>('todos', []);
	const donetasks = useStorage<ITask[]>('donetasks', []);
	$: showingtasks = $tasks;
	$: showingdonetasks = $donetasks;

	function addTask() {
		const input = usrinput.trim();
		if (input !== '') {
			let newTask: ITask = {
				id: generateRandomID(),
				task: input,
				completed: false,

				contenteditable: false
			};
			$tasks = [...$tasks, newTask];
			usrinput = '';
		}
	}

	function deleteTask(id: string) {
		$tasks = $tasks.filter((task) => task.id !== id);
	}
	function deleteDoneTask(id: string) {
		$donetasks = $donetasks.filter((task) => task.id !== id);
	}

	function generateRandomID() {
		let id: string;
		do {
			id = Math.random().toString(16).slice(2).toString();
		} while ($tasks.some((task) => task.id === id));
		return id;
	}

	function handleEnterKeyOnTextfield(event: KeyboardEvent | CustomEvent) {
		const keyboardEvent = event as KeyboardEvent;
		if (keyboardEvent.key === 'Enter') {
			addTask();
		}
	}

	function markAsDone(id: string, event: CustomEvent<any>) {
		let { checked } = event.target as HTMLInputElement;
		console.log(id);
		console.log(checked);
		const tempTask = $tasks.find((task) => task.id === id);

		if (tempTask) {
			tempTask.completed = true;
			$donetasks = [...$donetasks, tempTask];
			deleteTask(id);
		} else {
			console.error(`Task with id ${id} not found.`);
		}
	}
	function markAsNotDone(id: string, event: CustomEvent<any>) {
		let { checked } = event.target as HTMLInputElement;
		console.log(id);
		console.log(checked);
		const tempTask = $donetasks.find((task) => task.id === id);

		if (tempTask) {
			tempTask.completed = false;
			$tasks = [...$tasks, tempTask];
			deleteDoneTask(id);
		} else {
			console.error(`Task with id ${id} not found.`);
		}
	}

	function editTask(id: string) {
		const text: any = document.getElementById(id);
		text.contentEditable = true;
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
{#if showingtasks[0]}
	<div class="active-tasks">
		{#each showingtasks as task}
			<div class="eachtask">
				<Checkbox
					class="checkbox"
					on:change={(event) => markAsDone(task.id, event)}
					bind:checked={task.completed}
				/>
				<p id={task.id} class="taskname">{task.task}</p>
				<IconButton class="deletebutton" on:click={() => editTask(task.id)}>
					<Icon tag="svg" viewBox="0 0 24 24" class="deleteicon">
						<path fill="#FD4864" d={mdiPencilOutline} />
					</Icon>
				</IconButton>
				<IconButton class="deletebutton" on:click={() => deleteTask(task.id)}>
					<Icon tag="svg" viewBox="0 0 24 24" class="deleteicon">
						<path fill="#FD4864" d={mdiTrashCanOutline} />
					</Icon>
				</IconButton>
			</div>
		{/each}
	</div>
{:else}
	<p id="task-placeholder">Start writing some tasks...</p>
{/if}
<p>Done tasks:</p>

{#if showingdonetasks[0]}
	<div class="active-tasks">
		{#each showingdonetasks as task}
			<div class="eachtask">
				<Checkbox
					class="checkbox"
					on:change={(event) => markAsNotDone(task.id, event)}
					bind:checked={task.completed}
				/>
				<p class="taskname">{task.task}</p>

				<IconButton class="deletebutton" on:click={() => deleteDoneTask(task.id)}>
					<Icon tag="svg" viewBox="0 0 24 24" class="deleteicon">
						<path fill="#FD4864" d={mdiTrashCanOutline} />
					</Icon>
				</IconButton>
			</div>
		{/each}
	</div>
{:else}
	<p id="task-placeholder">No tasks marked as done yet. Get to work!</p>
{/if}
