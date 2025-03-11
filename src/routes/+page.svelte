<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { DropdownMenu } from 'bits-ui';

	let settingsOpen: boolean = $state(false);
	let connectionState: string = $state('disconnected');

	let websocketAddress: string = $state('localhost');
	let websocketPort: number = $state(55123);
	let ws: undefined | WebSocket = $state();

	type Button = {
		name: string;
		fn: string;
		args: Array<string>;
	};
	let buttons: Array<Button> = $state([]);

	let createButtonName: string = $state('');
	let createButtonFunction: string = $state('');
	let createButtonArgs: Array<string> = $state([]);

	function createWebsocket(): WebSocket {
		const createdWS = new WebSocket(
			'ws://' + websocketAddress + ':' + String(websocketPort),
			'json'
		);

		createdWS.onopen = (ev: Event) => {
			console.log('created', ev);
			connectionState = 'connected';
		};

		createdWS.onmessage = (ev: MessageEvent) => {
			console.log('message', ev);
		};

		createdWS.onerror = (ev: Event) => {
			console.log('error', ev);
			connectionState = 'error';
		};

		createdWS.onclose = (ev: CloseEvent) => {
			console.log('closed', ev);
			connectionState = 'disconnected';
			ws = undefined;
		};

		return createdWS;
	}

	function sendFunction(btn: Button) {
		if (!ws) throw new Error('No Websocket Configured');

		ws.send(
			JSON.stringify({
				head: {
					id: 'InfSet'
				},
				body: {
					fn: btn.fn,
					args: btn.args
				}
			})
		);
	}
</script>

<nav class="flex w-full flex-row items-center justify-between p-2 bg-sky-200">
	<button class="rounded border" type="button" onclick={() => (settingsOpen = !settingsOpen)}
		>Settings</button
	>

	{#if settingsOpen}
	<div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="border rounded-lg p-2">Add Button</DropdownMenu.Trigger>
			<DropdownMenu.Content class="flex flex-col gap-4 border p-4 bg-white rounded">
				<div class="flex flex-col">
					<label for="buttonName">Button Name</label>
					<input type="text" name="buttonName" id="buttonName" bind:value={createButtonName} />
				</div>

				<div class="flex flex-col">
					<label for="buttonFunction">Function</label>
					<input
						type="text"
						name="buttonFunction"
						id="buttonFunction"
						bind:value={createButtonFunction}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="buttonArgs">Args</label>
					{#each createButtonArgs as buttonArg, index}
						<input type="text" name="createButtonArg" id={"createButtonArg" + String(index)} bind:value={createButtonArgs[index]}>
						
					{/each}
					<button class="p-1" type="button" onclick={() => {
						createButtonArgs.push('')
					}}>Add Arg</button>
				</div>
				<button
					type="button"
					onclick={() => {
						buttons.push({
							name: String(createButtonName),
							fn: createButtonFunction,
							args: createButtonArgs
						});

						createButtonName = '';
						createButtonFunction = '';
						createButtonArgs = [];
					}}>Add Button</button
				>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<button>Load</button>
		<button>Save</button>
	</div>

		<div>
			<label for="wsAddress">IP Address:</label>
			<input type="text" name="wsAddress" id="wsAddress" bind:value={websocketAddress} />
		</div>

		<div>
			<label for="wsPort">Port:</label>
			<input type="number" name="wsPort" id="wsPort" bind:value={websocketPort} />
		</div>

		<button
			type="button"
			onclick={() => {
				if (!ws) {
					ws = createWebsocket();
				} else {
					ws.close();
				}
			}}>Connect / Disconnect</button
		>
	{/if}

	<p
		class={twMerge(
			'rounded-full p-2',
			connectionState === 'connected' && 'bg-emerald-500 text-white',
			connectionState === 'error' && 'bg-rose-500 text-white',
			connectionState === 'disconnected' && 'bg-slate-700 text-white',
		)}
	>
		{connectionState}
	</p>
</nav>

<main class="p-10">
{#each buttons as button}
	<button
		class="h-48 w-48 text-center disabled:opacity-50 hover:bg-slate-300"
		type="button"
		disabled={connectionState !== 'connected'}
		onclick={() => sendFunction(button)}>{button.name}</button
	>
{/each}
</main>

<style>
	input {
		border: solid 1px gray;
		border-radius: 5px;
		box-shadow: inset 1em gray;
		padding: 0.5em;
	}

	button {
		border: solid 1px gray;
		border-radius: 5px;
		padding: 0.5em;
	}
</style>
