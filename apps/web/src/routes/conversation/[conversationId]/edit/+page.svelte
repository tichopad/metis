<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';

  export let data;

  let isFormSubmitting = false;
  $: submitBtnText = isFormSubmitting ? 'Sending...' : 'Save';

  const enhanceForm: SubmitFunction = () => {
    isFormSubmitting = true;
    return async ({ update }) => {
      await update();
      isFormSubmitting = false;
    };
  };
</script>

<main>
  <form method="post" use:enhance={enhanceForm}>
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
    <br />

    <!-- Select for each item in data.allGroups with the currently selected one being the one in data.group -->
    <label for="group">Group:</label>
    <select id="group" name="group">
      {#each data.allGroups as group}
        <option value={group.id} selected={group.id === data.conversation.group_id}>
          {group.name}
        </option>
      {/each}
    </select>

    <button disabled={isFormSubmitting} type="submit">{submitBtnText}</button>
  </form>
</main>
