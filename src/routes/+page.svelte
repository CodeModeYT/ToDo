<script lang="ts">
	import Textfield from '@smui/textfield';
	import IconButton from '@smui/icon-button';
	import {
		mdiContentSaveOutline,
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
		text.style;
		text.contentEditable = true;
		text.classList.add('editabletask');
		const task = $tasks.find((task) => task.id === id);
		if (task) {
			task.contenteditable = true;
			showingtasks = showingtasks;
		}
	}

	function saveTask(id: string) {
		const text: any = document.getElementById(id);
		text.contentEditable = false;
		text.classList.remove('editabletask');
		const taskIndex = $tasks.findIndex((task) => task.id === id);
		if (taskIndex !== -1) {
			$tasks[taskIndex].contenteditable = false;
			$tasks[taskIndex].task = text.textContent;
			$tasks = [...$tasks];
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
	></Textfield>
	<button id="input_button" class="button" on:click={addTask}>
		<Icon tag="svg" viewBox="0 0 24 24" class="plusicon">
			<path fill="#FD4864" d={mdiPlus} />
		</Icon>
	</button>
</div>
<p class="task-sections">ToDo:</p>
{#if showingtasks[0]}
	<div class="containeractive">
		<div class="active-tasks">
			{#each showingtasks as task}
				<div class="eachtask">
					<Checkbox
						class="checkbox"
						on:change={(event) => markAsDone(task.id, event)}
						bind:checked={task.completed}
					/>
					<p id={task.id} class="taskname">{task.task}</p>
					{#if task.contenteditable === false}
						<IconButton class="actionicons" on:click={() => editTask(task.id)}>
							<Icon tag="svg" viewBox="0 0 24 24">
								<path fill="#FD4864" d={mdiPencilOutline} />
							</Icon>
						</IconButton>
					{/if}
					{#if task.contenteditable}
						<IconButton class="actionicons" on:click={() => saveTask(task.id)}>
							<Icon tag="svg" viewBox="0 0 24 24">
								<path fill="#FD4864" d={mdiContentSaveOutline} />
							</Icon>
						</IconButton>
					{/if}
					<IconButton class="actionicons" on:click={() => deleteTask(task.id)}>
						<Icon tag="svg" viewBox="0 0 24 24">
							<path fill="#FD4864" d={mdiTrashCanOutline} />
						</Icon>
					</IconButton>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="placeholder-container">
		<p class="task-placeholder">Start writing some tasks...</p>
	</div>
{/if}
<hr class="divider" />
<p class="task-sections">Done tasks:</p>

{#if showingdonetasks[0]}
	<div class="containerdone">
		<div class="done-tasks">
			{#each showingdonetasks as task}
				<div class="eachdonetask">
					<Checkbox
						class="checkbox"
						on:change={(event) => markAsNotDone(task.id, event)}
						bind:checked={task.completed}
					/>
					<p class="taskname">{task.task}</p>
					<IconButton class="actionicons" on:click={() => deleteDoneTask(task.id)}>
						<Icon tag="svg" viewBox="0 0 24 24">
							<path fill="#FD4864" d={mdiTrashCanOutline} />
						</Icon>
					</IconButton>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<p class="task-placeholder">No tasks marked as done yet. Get to work!</p>
{/if}
