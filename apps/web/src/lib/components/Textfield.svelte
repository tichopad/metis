<script lang="ts">
	export let name: string | undefined = undefined;
</script>

<div class="wrapper spectrum-Textfield spectrum-Textfield--multiline">
	<textarea {name} class="spectrum-Textfield-input" />
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
	}
</style>
