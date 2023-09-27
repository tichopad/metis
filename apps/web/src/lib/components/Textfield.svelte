<script lang="ts">
  export let name: string | undefined = undefined;
</script>

<textarea {name} on:keydown />

<style>
  textarea {
    width: 100%;
    height: 100%;
  }
</style>
