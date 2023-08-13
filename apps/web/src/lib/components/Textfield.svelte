<script lang="ts">
	export let name: string | undefined = undefined;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="wrapper spectrum-Textfield spectrum-Textfield--multiline">
	<textarea
		{name}
		class="spectrum-Textfield-input"
		on:keydown={(event) => {
			if (event.key === 'Enter' && event.ctrlKey) {
				dispatch('submit', { value: event.currentTarget?.value });
			}
		}}
	/>
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
	}
</style>
