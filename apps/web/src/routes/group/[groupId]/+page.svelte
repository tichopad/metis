<script lang="ts">
  export let data;
</script>

<main>
  <h1>{data.group.name}</h1>
  <h2>System prompt</h2>
  <p>{data.group.system_prompt}</p>
  <a href="/conversation/create">Create conversation</a>
</main>
