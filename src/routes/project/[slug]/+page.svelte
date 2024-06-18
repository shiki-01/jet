<script lang="ts">
	import type { PageData } from './$types';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';

	export let data: PageData;

	let menu: boolean = false;
</script>

<div class="absolute bottom-5 right-5 menuClose" class:menuOpen={menu}>
	<Button
		class="rounded-full p-2 shadow-lg"
		on:click={() => {
			menu = !menu;
		}}
	>
		<Plus class="p-0" />
	</Button>
</div>
<main class="p-5 w-full h-full flex flex-col">
	<div>
		<h1>Project Page</h1>
		<p>Current Slug: {data.props.slug}</p>
	</div>
	<div class="pt-5 w-full h-full">
		<Textarea class="resize-none w-full h-full" />
	</div>
</main>

<style>
	.menuClose {
		transform: rotate(45deg);
		transition: transform 0.3s;
	}
	.menuOpen {
		transform: rotate(0deg);
		transition: transform 0.3s;
	}
</style>
