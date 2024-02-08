<script lang="ts">
	import Textfield from '@smui/textfield';
	import IconButton from '@smui/icon-button';
	import { mdiContentSaveOutline, mdiPencilOutline, mdiPlus, mdiTrashCanOutline } from '@mdi/js';
	import { Icon } from '@smui/fab';
	import { useStorage } from '$lib/store';
	import type { ITask } from '$lib/taskType';
	import Checkbox from '@smui/checkbox';

	let usrinput = '';

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

	function handleEnterKeyOnEdit(id: string, event: KeyboardEvent | CustomEvent) {
		const keyboardEvent = event as KeyboardEvent;

		if (keyboardEvent.key === 'Enter') {
			saveTask(id);
		}
	}

	function markAsDone(id: string, event: CustomEvent<any>) {
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
		text.addEventListener('keydown', (event: KeyboardEvent) => handleEnterKeyOnEdit(id, event));
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
		text.removeEventListener('keydown', (event: KeyboardEvent) => handleEnterKeyOnEdit(id, event));
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
		label="Start writing some tasks down..."
		input$maxlength={100}
		on:keydown={handleEnterKeyOnTextfield}
		class="inputfield"
	></Textfield>
	<button id="input_button" class="plusbutton" on:click={addTask}>
		<Icon tag="svg" viewBox="0 0 24 24" class="plusicon">
			<path fill="#FD4864" d={mdiPlus} />
		</Icon>
	</button>
</div>

<p class="section-heading">ToDo:</p>

{#if showingtasks[0]}
	<div class="container_active-tasks">
		<div class="list_active-tasks">
			{#each showingtasks as task}
				<div class="each_active-tasks">
					<Checkbox
						on:change={(event) => markAsDone(task.id, event)}
						bind:checked={task.completed}
					/>
					<p id={task.id} class="taskname">{task.task}</p>
					{#if task.contenteditable === false}
						<IconButton class="each_actionicons" on:click={() => editTask(task.id)}>
							<Icon tag="svg" viewBox="0 0 24 24">
								<path fill="#FD4864" d={mdiPencilOutline} />
							</Icon>
						</IconButton>
					{/if}
					{#if task.contenteditable}
						<IconButton class="each_actionicons" on:click={() => saveTask(task.id)}>
							<Icon tag="svg" viewBox="0 0 24 24">
								<path fill="#FD4864" d={mdiContentSaveOutline} />
							</Icon>
						</IconButton>
					{/if}
					<IconButton class="each_actionicons" on:click={() => deleteTask(task.id)}>
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
		<p class="placeholder">No tasks yet. Create a new one above!</p>
	</div>
{/if}

<hr class="divider" />
<p class="section-heading">Done tasks:</p>

{#if showingdonetasks[0]}
	<div class="container_done-tasks">
		<div class="list_done-tasks">
			{#each showingdonetasks as task}
				<div class="each_done-tasks">
					<Checkbox
						class="checkbox"
						on:change={(event) => markAsNotDone(task.id, event)}
						bind:checked={task.completed}
					/>
					<p class="taskname_done">{task.task}</p>
					<div class="list_actionicons">
						<IconButton class="actionicons_done" on:click={() => deleteDoneTask(task.id)}>
							<Icon tag="svg" viewBox="0 0 24 24">
								<path fill="#FD4864" d={mdiTrashCanOutline} />
							</Icon>
						</IconButton>
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="placeholder-container">
		<p class="placeholder">No tasks marked as done yet! Get to work!</p>
	</div>
{/if}
