<script lang="ts">
	import type { Snippet } from 'svelte';
	import { draggable } from '@neodrag/svelte';
	import { buttonStore } from './buttonStore.svelte';
	import { SettingsIcon } from '@lucide/svelte';

	const {
		id,
		name,
		colour,
		size,
		edit,
		activateEditWindow
	}: {
		id: string;
		name: string;
		description?: string;
		colour: string;
		children?: Snippet;
		size: number;
		order: number;
		class?: string;
		edit: boolean;
		activateEditWindow: Function;
	} = $props();

	let touch = $state(false);
</script>

<div
	use:draggable={{ disabled: !edit, bounds: 'parent' }}
	{id}
	onmousedown={async () => {
		if (!edit && !touch) {
			await buttonStore.activateButton(id);
		}
	}}
	onmouseup={async () => {
		if (!edit && !touch) {
			await buttonStore.deactivateButton(id);
		}
	}}
	ontouchstart={async () => {
		if (!edit) {
			await buttonStore.activateButton(id);
			touch = true;
			setTimeout(() => {
				touch = false;
			}, 10);
		}
	}}
	ontouchend={async () => {
		if (!edit) {
			await buttonStore.deactivateButton(id);
			touch = true;
			setTimeout(() => {
				touch = false;
			}, 10);
		}
	}}
	role="button"
	tabindex="-1"
	class="relative flex flex-col items-center text-center justify-evenly border rounded-lg cursor-pointer"
	style={`width: ${size}px; height: ${size}px`}
>
	{#if edit}
		<SettingsIcon class="w-4 h-4 absolute top-2 right-2" onclick={() => {
			activateEditWindow(id)
		}} />
	{/if}
	<svg
		viewBox={`0 0 ${size} ${size}`}
		class="absolute top-0 left-0 -z-10 rounded-lg w-full h-full"
		height={size}
		width={size}
		fill="none"
		style={`background-color: ${colour}`}
	>
		<rect
			height={size}
			width={size}
			class="border rounded-lg w-full h-full"
			onclick={() => {
				console.log('clickerd');
			}}
		/>
	</svg>
	<h1>{name}</h1>
</div>
