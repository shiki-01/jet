<script lang="ts">
	import { onMount } from 'svelte';
	import DirTree from './DirTree.svelte';

	let projects: any;
	onMount(async () => {
		projects = await window.electron.project.get();
		console.log(projects);
	});
</script>

<div class="w-full h-full">
	<a href="/">Svelte REPL</a>
	{#if projects}
		<DirTree {projects} />
	{:else}
		<div>Loading...</div>
	{/if}
</div>
