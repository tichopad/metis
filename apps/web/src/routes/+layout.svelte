<script>
  export let data;
</script>

<div class="layout-wrapper">
  <nav class="sidebar">
    <h2><a href="/">Home</a></h2>
    <div class="sidebar__toolbar">
      <a href="/group/create">Create group</a>
    </div>
    {#if data.conversationsList.withoutGroup.length > 0}
      <ul class="list list--groups">
        <li class="list__title">
          <em>Draft</em>
          <a href="/group/-/conversation/create">+</a>
        </li>
        <ul class="list list--conversations">
          {#each data.conversationsList.withoutGroup as conversation (conversation.id)}
            <li>
              <a href={`/conversation/${conversation.id}`}>{conversation.name}</a>
            </li>
          {/each}
        </ul>
      </ul>
    {/if}
    {#if data.conversationsList.withGroup.size > 0}
      <ul class="list list--groups">
        {#each data.conversationsList.withGroup as [id, group] (id)}
          <li class="list__title">
            <a href={`/group/${id}`}>{group.name}</a><a
              href={`/group/${group.id}/conversation/create`}>+</a
            >
          </li>
          {#if group.conversations.length > 0}
            <ul class="list list--conversations">
              {#each group.conversations as conversation (conversation.id)}
                <li>
                  <a href={`/conversation/${conversation.id}`}>{conversation.name}</a>
                </li>
              {/each}
            </ul>
          {/if}
        {/each}
      </ul>
    {/if}
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

  .sidebar__toolbar {
    margin-bottom: 20px;
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

  .list__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
