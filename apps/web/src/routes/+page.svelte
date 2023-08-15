<script lang="ts">
	export let data;

	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Textfield from '$lib/components/Textfield.svelte';

	let formElement: HTMLFormElement;
	let isLoadingNewMessage = false;
</script>

<main>
	{#if !data?.messages.length}
		<p>Ask something.</p>
	{:else}
		{#each data.messages as message}
			<p>{message.content}</p>
		{/each}
	{/if}
	{#if isLoadingNewMessage}
		<p>Loading...</p>
	{/if}
</main>
<form
	action="?/prompt"
	class="prompt-form"
	method="POST"
	bind:this={formElement}
	use:enhance={() => {
		return async ({ update, formData }) => {
			const promptMessage = String(formData.get('prompt'));
			data.messages = [...data.messages, { role: 'user', content: promptMessage }];
			isLoadingNewMessage = true;
			await update({ reset: true });
			isLoadingNewMessage = false;
		};
	}}
>
	<div
		class="inner"
		role="presentation"
		on:keydown={(event) => {
			// Submit form on Ctrl+Enter
			if (event.key === 'Enter' && event.ctrlKey) {
				formElement.requestSubmit();
			}
		}}
	>
		<div class="textfield">
			<Textfield name="prompt" />
		</div>
		<Button primary label="Send" type="submit" />
	</div>
</form>

<style>
	.prompt-form {
		width: 100%;
		height: 100px;
		position: absolute;
		bottom: 0;
		left: 0;
		background: linear-gradient(
			to bottom,
			transparent,
			var(--spectrum-alias-background-color-default) 65%
		);
	}

	.inner {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 30px;
	}

	.textfield {
		width: 80%;
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
