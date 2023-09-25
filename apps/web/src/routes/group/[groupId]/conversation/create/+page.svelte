<script lang="ts">
	export let data;
</script>

<main>
	<h1>Create conversation in {data.group.name} group</h1>
	<form method="post">
		<label for="name">Name:</label>
		<input type="text" id="name" name="name" required />

		<label for="description">Description:</label>
		<input type="text" id="description" name="description" required />

		<button type="submit">Create</button>
	</form>
</main>
