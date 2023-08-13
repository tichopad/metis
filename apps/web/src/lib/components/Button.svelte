<script lang="ts">
	export let label = 'Button';
	export let primary = false;
	export let type: 'button' | 'submit' = 'button';

	let isFocused = false;
</script>

<button
	{type}
	class="spectrum-Button spectrum-Button--fill spectrum-Button--sizeL"
	class:focus-ring={isFocused}
	class:spectrum-Button--primary={primary}
	on:focusin={() => {
		isFocused = true;
	}}
	on:blur={() => {
		isFocused = false;
	}}
>
	<span class="spectrum-Button-label">{label}</span>
</button>
