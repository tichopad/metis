<script lang="ts">
  import { enhance } from '$app/forms';

  export let data;
</script>

<main>
  <form method="post" use:enhance>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" value={data.group.name} required />
    <br />

    <label for="system_prompt">System prompt:</label>
    <input type="text" id="system_prompt" name="system_prompt" value={data.group.system_prompt} />
    <br />

    <button type="submit">Save</button>
  </form>
</main>
