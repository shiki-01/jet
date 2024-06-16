<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { X, Maximize, Minus } from 'lucide-svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import Header from '$lib/Header.svelte';
	import Menubar from '$lib/Menubar.svelte';
	let showDragbar: boolean;
	let ready: boolean = false;

	onMount(() => {
		const platform = import.meta.env.VITE_APP_PLATFORM;
		showDragbar = platform === 'win32';
		ready = true;
		console.log(import.meta.env.VITE_APP_PLATFORM);
	});
</script>

<div class="main">
	{#if showDragbar}
		<div class="dragbar justify-between">
			<div class="no-drag">
				<Menubar />
			</div>
			<div class="no-drag flex align-middle">
				<button
					on:click={() => window.electron.window.minimize()}
					class="no-drag"
					style="float: right; margin-right: 10px"
				>
					<Minus size="20" />
				</button>
				<button
					on:click={() => window.electron.window.maximize()}
					class="no-drag"
					style="float: right; margin-right: 10px"
				>
					<Maximize size="20" />
				</button>
				<button
					on:click={() => window.electron.window.close()}
					class="no-drag"
					style="float: right; margin-right: 10px"
				>
					<X size="20" />
				</button>
			</div>
		</div>
	{/if}

	{#if ready}
		<main class="p-5 w-full h-full">
			<Resizable.PaneGroup direction="horizontal">
				<Resizable.Pane defaultSize={18} minSize={10}>
					<Header />
				</Resizable.Pane>
				<Resizable.Handle />
				<Resizable.Pane minSize={10}>
					<slot />
				</Resizable.Pane>
			</Resizable.PaneGroup>
		</main>
	{/if}
</div>

<style>
	.dragbar {
		-webkit-app-region: drag;
		height: 40px;
		width: 100%;
		display: flex;
	}

	.no-drag {
		-webkit-app-region: no-drag;
	}

	.main {
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
	}
</style>
