<script>
	const conversations = [
		{ name: 'Conversation 1', link: '/g/1/c/1' },
		{ name: 'Conversation 2', link: '/g/2/c/1' },
		{ name: 'Conversation 3', link: '/g/3/c/1' }
	];
</script>

<div class="layout-wrapper">
	<nav class="sidebar">
		<h3>Conversations</h3>
		<ul>
			{#each conversations as conversation}
				<li><a href={conversation.link}>{conversation.name}</a></li>
			{/each}
		</ul>
	</nav>
	<section class="page-content">
		<slot />
	</section>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.layout-wrapper {
		display: flex;
		overflow: hidden;
		height: 100vh;
		width: 100vw;
		padding: 0;
	}

	.page-content {
		position: relative;
		height: 100%;
		width: 100%;
	}

	.sidebar {
		width: 250px;
		height: 100%;
		padding: 20px;
		overflow-x: hidden;
		flex-shrink: 0;

		& h3 {
			margin-top: 0;
		}

		& ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		& li {
			margin-bottom: 10px;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
</style>
