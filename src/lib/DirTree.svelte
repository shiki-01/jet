<script lang="ts">
	import DirTree from './DirTree.svelte';
	export let projects: any;

	function formatPath(path: string): string {
		const parts = path.split('\\');
		const jetProjectDataIndex = parts.indexOf('JetProjectData');
		if (jetProjectDataIndex !== -1) {
			return '/project/' + parts.slice(jetProjectDataIndex + 1).join('-');
		}
		return path.replace(/\\/g, '/');
	}
</script>

<div class="w-full h-full">
	{#if projects}
		{#each projects as project}
			{#if project.type === 'directory'}
				<div class="text-sm text-gray-500">
					{project.name}
				</div>
				<div class="ml-2">
					<DirTree projects={project.children} />
				</div>
			{:else}
				<div class="text-sm text-gray-500">
					<a href={formatPath(project.path)} rel="noopener noreferrer">{project.name}</a>
				</div>
			{/if}
		{/each}
	{:else}
		<div>Loading...</div>
	{/if}
</div>
