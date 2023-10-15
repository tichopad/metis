<script lang="ts">
  export let data;
</script>

<main>
  <form method="post">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" value={data.conversation.name} required />
    <br />

    <label for="description">Description:</label>
    <input
      type="text"
      id="description"
      name="description"
      value={data.conversation.description}
      required
    />
    <br />

    <label for="system_prompt">System prompt:</label>
    <input
      type="text"
      id="system_prompt"
      name="system_prompt"
      value={data.conversation.system_prompt}
    />

    <button type="submit">Save</button>
  </form>
</main>
