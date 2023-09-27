<script>
  export let data;
</script>

<div class="layout-wrapper">
  <nav class="sidebar">
    <h2><a href="/">Home</a></h2>
    <ul class="list list--groups">
      {#each data.groups as group (group.id)}
        <li><a href={`/group/${group.id}`}>{group.name}</a></li>
        <ul class="list list--conversations">
          {#each group.conversations as conversation (conversation.id)}
            <li>
              <a href={`/group/${group.id}/conversation/${conversation.id}`}>{conversation.name}</a>
            </li>
          {/each}
        </ul>
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
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;

    & li {
      margin-bottom: 10px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .list--groups {
    & li {
      font-weight: bold;
    }
  }

  .list--conversations {
    margin-left: 2rem;
  }
</style>
