<script lang="ts">
  import { enhance } from '$app/forms';
  import Button from '$lib/components/Button.svelte';
  import Textfield from '$lib/components/Textfield.svelte';
  import type { SubmitFunction } from '@sveltejs/kit';

  export let data;

  let formElement: HTMLFormElement;
  let isLoadingNewMessage = false;

  $: console.log('Conversation', data.conversation);

  // Handle client-side form enhancement (loading state, optimistic update)
  const enhanceForm: SubmitFunction = ({ formData }) => {
    // TODO: Validate form data
    const promptMessage = String(formData.get('prompt'));
    formElement.reset();
    data.messages = [
      ...data.messages,
      {
        author: 'user',
        content: promptMessage,
        conversation_id: data.conversation.id,
        id: 'NEW',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    isLoadingNewMessage = true;
    return async ({ update }) => {
      await update();
      isLoadingNewMessage = false;
    };
  };

  // Submit on Ctrl+Enter when focused inside the form
  const submitFormOnCtrlEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      formElement.requestSubmit();
    }
  };
</script>

<main>
  <h1>Group {data.group?.name ?? 'No group'} Conversation {data.conversation.name}</h1>
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
  use:enhance={enhanceForm}
>
  <div class="textfield">
    <Textfield name="prompt" on:keydown={submitFormOnCtrlEnter} />
  </div>
  <Button primary label="Send" type="submit" />
</form>

<style>
  .prompt-form {
    width: 100%;
    height: 100px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    background: linear-gradient(to bottom, transparent, gray 65%);
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
