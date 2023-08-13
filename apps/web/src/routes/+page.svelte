<script lang="ts">
	export let form;

	const content = form;
</script>

<form class="prompt-input" method="POST">
	<div class="prompt-input__textfield spectrum-Textfield spectrum-Textfield--multiline">
		<textarea name="prompt" class="spectrum-Textfield-input" />
	</div>
	<button
		type="submit"
		class="prompt-input__button spectrum-Button spectrum-Button--fill spectrum-Button--primary spectrum-Button--sizeL"
	>
		<span class="spectrum-Button-label">Send</span>
	</button>
</form>

<main>
	{#if !content?.length}
		<p>Nothing here yet.</p>
	{:else}
		{#each content as line}
			<p>{line}</p>
		{/each}
	{/if}
</main>

<style>
	.prompt-input {
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

		& .prompt-input__textfield {
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
