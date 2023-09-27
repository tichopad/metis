<script lang="ts">
  export let data;
</script>

<main>
  <h1>{data.group.name}</h1>
  <h2>System prompt</h2>
  <p>{data.group.systemPrompt}</p>
  <a href="/group/{data.group.id}/conversation/create">Create conversation</a>
</main>
