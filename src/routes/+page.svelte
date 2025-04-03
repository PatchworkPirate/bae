<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { buttonStore, type ButtonObject } from '$lib/buttonStore.svelte';
	import ScreenButton from '$lib/ScreenButton.svelte';
	import { Dialog } from 'bits-ui';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let creatingButton: ButtonObject = $state(buttonStore.createButton());

	let addButtonDialogOpen: boolean = $state(false);
	let edit: boolean = $state(false);

	let broadcast: undefined | BroadcastChannel;
	let peer: undefined | RTCPeerConnection;

	function activateEditWindow(id: string) {
		const foundButton = buttonStore.buttons.find((btn) => btn.id === id);

		if (!foundButton) {
			throw new Error("Couldn't find button with id: " + id);
		}

		creatingButton = foundButton;
		addButtonDialogOpen = true;
	}

	onMount(async () => {
		broadcast = new BroadcastChannel('buttons');
		peer = new RTCPeerConnection();
		const webcam = await navigator.mediaDevices.getUserMedia({
			video: { height: 1080, width: 1920 }
		});

		const video = document.getElementById('videoSource') as HTMLVideoElement;
		video.srcObject = webcam;
	});
</script>

<nav class="flex flex-row gap-10 bg-red-500 px-2 py-1 mb-2 shadow items-center">
	<Dialog.Root
		bind:open={addButtonDialogOpen}
		onOpenChange={(open: boolean) => {
			if (open) {
				creatingButton = buttonStore.createButton();
			}
		}}
	>
		<Dialog.Trigger
			class="flex flex-row bg-white text-black rounded-lg px-4 py-2 shadow hover:bg-slate-300 transition-colors"
			>Add Button</Dialog.Trigger
		>
		<Dialog.Portal>
			<Dialog.Content
				transition={fade}
				transitionConfig={{ duration: 100 }}
				class="absolute top-20 translate-x-[50%] flex flex-row items-center gap-6 p-10 rounded-lg shadow-lg border-2 border-red-500 mx-auto w-1/2 bg-white z-50"
			>
				<div class="flex flex-col gap-6 items-start align-middle">
					<div>
						<label for="buttonId">Button ID</label>
						<input type="text" name="buttonId" id="buttonId" disabled value={creatingButton.id} />
					</div>
					<div>
						<label for="buttonName">Button Name</label>
						<input type="text" name="buttonName" id="buttonName" bind:value={creatingButton.name} />
					</div>
					<div>
						<label for="buttonDescription">Button Description</label>
						<input type="text" name="buttonDescription" id="buttonDescription" />
					</div>
					<div class="grid grid-cols-2 grid-flow-row">
						<label for="pageNumber">Compaion Page</label>
						<input
							type="number"
							name="pageNumber"
							id="pageNumber"
							bind:value={creatingButton.triggers.page}
						/>
						<label for="bankNumber">Button Row</label>
						<input
							type="number"
							name="bankNumber"
							id="bankNumber"
							bind:value={creatingButton.triggers.row}
						/>
						<label for="buttonNumber">Button Column</label>
						<input
							type="number"
							name="buttonNumber"
							id="buttonNumber"
							bind:value={creatingButton.triggers.column}
						/>
					</div>

					<div>
						<label for="buttonColour">Button Colour</label>
						<input
							type="color"
							name="buttonColour"
							id="buttonColour"
							bind:value={creatingButton.colour}
						/>
					</div>
					<div>
						<label for="buttonSize">Button Size</label>
						<input
							type="number"
							name="buttonSize"
							id="buttonSize"
							bind:value={creatingButton.size}
						/>
					</div>
					<div>
						{#if !edit}
							<button
								class="border px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
								type="button"
								onclick={() => {
									buttonStore.addButton(creatingButton);
									addButtonDialogOpen = false;
								}}>Add</button
							>
						{:else}
							<button
								class="border px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
								type="button"
								onclick={() => {
									addButtonDialogOpen = false;
								}}>Close</button
							>
							<button
								class="border px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
								type="button"
								onclick={() => {
									buttonStore.removeButton(creatingButton.id);
									addButtonDialogOpen = false;
								}}
							>
								Remove
							</button>
						{/if}
					</div>
				</div>
				<Button edit={false} {...creatingButton} {activateEditWindow}>{creatingButton.name}</Button>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>

	<div class="flex flex-row items-center gap-4">
		<label for="editActive">Edit</label>
		<input class="w-4 h-4" type="checkbox" name="editActive" id="editActive" bind:checked={edit} />
	</div>

	<div class="flex flex-row gap-4 items-center">
		<label class=" text-nowrap" for="ipAddress">Companion IP</label>
		<input
			class="rounded"
			type="text"
			name="ipAddress"
			id="ipAddress"
			bind:value={buttonStore.ipAddress}
		/>
	</div>
	<div class="flex flex-row gap-4 items-center">
		<label class="text-nowrap" for="portNumber">Port Number</label>
		<input
			class="rounded"
			type="number"
			name="portNumber"
			id="portNumber"
			bind:value={buttonStore.port}
		/>
	</div>
</nav>

<main class="flex flex-row">
	<div class="w-1/2 relative aspect-video">
		<video id="videoSource" class="absolute top-0 left-0 w-full h-full bg-emerald-500" autoplay>
			<track kind="captions" /></video
		>
		<div class="grid grid-cols-2 grid-rows-2 absolute top-0 left-0 w-full h-full z-20">
			{#each buttonStore.buttons as button, index}
				{#if index < 4}
					<ScreenButton {...button} {edit} {activateEditWindow}>{button.name}</ScreenButton>
				{/if}
			{/each}
		</div>
	</div>
	<aside id="companionContainer" class="flex flex-row gap-2 w-1/2">
		{#each buttonStore.buttons as button, index}
			{#if index > 3}
				<Button {...button} {edit} {activateEditWindow}>{button.name}</Button>
			{/if}
		{/each}
	</aside>
</main>

<style>
	input {
		padding: 2%;
		border: 1px solid gray;
		border-radius: 4px;
	}
</style>
