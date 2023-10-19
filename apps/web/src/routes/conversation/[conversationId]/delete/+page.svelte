<script lang="ts">
  export let data;
</script>

<main>
  <h1>Delete {data.conversation.name}</h1>
  <p>Are you sure you want to delete this conversation?</p>
  <form method="post">
    <button type="submit">Delete</button>
  </form>
</main>
