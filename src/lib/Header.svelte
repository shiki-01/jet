<script lang="ts">
	import { onMount } from 'svelte';

	let projects: any;
	onMount(async () => {
		projects = await window.electron.project.get();
		console.log(projects);
	});
</script>

<div class="w-full h-full">
	<p>hello</p>
</div>
