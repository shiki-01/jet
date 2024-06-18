<script lang="ts">
	export let slug: string[] = [];

	console.log(slug);
</script>

<main>
	<h1>Project Page</h1>
	<p>Current Slug: {slug && slug.join('/')}</p>
</main>
