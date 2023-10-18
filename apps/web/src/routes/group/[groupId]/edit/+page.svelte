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
    <input type="text" id="name" name="name" value={data.group.name} required />
    <br />

    <label for="system_prompt">System prompt:</label>
    <input type="text" id="system_prompt" name="system_prompt" value={data.group.system_prompt} />
    <br />

    <button disabled={isFormSubmitting} type="submit">{submitBtnText}</button>
  </form>
</main>
