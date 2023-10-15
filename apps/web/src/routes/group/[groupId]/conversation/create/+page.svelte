<script lang="ts">
  export let data;

  let title = 'Create draft conversation';
  if (data.group) {
    title = `Create conversation in ${data.group.name} group`;
  }
</script>

<main>
  <h1>{title}</h1>
  <form method="post">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required />
    <br />

    <label for="description">Description:</label>
    <input type="text" id="description" name="description" required />
    <br />

    <label for="system_prompt">System prompt:</label>
    <input type="text" id="system_prompt" name="system_prompt" />

    <button type="submit">Create</button>
  </form>
</main>
