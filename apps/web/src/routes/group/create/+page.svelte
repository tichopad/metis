<script>
	import { enhance } from '$app/forms';
</script>

<main>
	<h1>Create group</h1>
	<form method="post" use:enhance>
		<label for="name">Name</label>
		<input type="text" id="name" name="name" required />

		<label for="system-prompt">System prompt</label>
		<input type="text" id="system-prompt" name="system-prompt" />

		<button type="submit">Create</button>
	</form>
</main>

<style>
	main {
		padding: 2rem;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}
</style>
