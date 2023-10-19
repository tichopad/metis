<script lang="ts">
  export let data;
</script>

<main>
  <h1>Delete {data.group.name}</h1>
  <p>Are you sure you want to delete this group and all its conversations?</p>
  <form method="post">
    <button type="submit">Delete</button>
  </form>
</main>
