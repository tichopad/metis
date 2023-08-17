<script lang="ts">
	export let name: string | undefined = undefined;
</script>

<div class="wrapper spectrum-Textfield spectrum-Textfield--multiline">
	<textarea autofocus class="spectrum-Textfield-input" {name} on:keydown />
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
	}
</style>
