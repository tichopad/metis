<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Textfield from '$lib/components/Textfield.svelte';

	export let form;

	let formElement: HTMLFormElement;
</script>

<form bind:this={formElement} class="prompt" method="POST" use:enhance>
	<div class="textfield">
		<Textfield name="prompt" on:submit={() => formElement.requestSubmit()} />
	</div>
	<Button primary label="Send" type="submit" />
</form>

<main>
	{#if !form?.length}
		<p>Nothing here yet.</p>
	{:else}
		{#each form as line}
			<p>{line}</p>
		{/each}
	{/if}
</main>

<style>
	.prompt {
		width: 100%;
		height: 100px;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		bottom: 0;
		left: 0;
		gap: 30px;
		background: linear-gradient(
			to bottom,
			transparent,
			var(--spectrum-alias-background-color-default) 65%
		);

		& .textfield {
			width: 80%;
		}
	}

	main {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		width: 100%;
		height: 100%;
		padding: 20px;
		padding-bottom: 150px;
	}
</style>
