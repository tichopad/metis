<script lang="ts">
  export let label = 'Button';
  export let primary = false;
  export let type: 'button' | 'submit' = 'button';
</script>

<button {type} class:spectrum-Button--primary={primary}>
  <span>{label}</span>
</button>
