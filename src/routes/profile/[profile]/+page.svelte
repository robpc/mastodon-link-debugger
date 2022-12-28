<script lang="ts">
  import type { PageData } from './$types';
  import LinkChecklist from './LinkChecklist.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <title>Mastodon Link Debugger - {data.profile}</title>
</svelte:head>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-0">
    <h2>{data.profile}</h2>
    <h1>{data.name}</h1>
    <a href="../" class="text-xs mt-0.5">Enter new profile</a>
  </div>
  <div class="flex flex-col gap-1">
    {#if data.links.length > 0}
      <h3>Link Verifications</h3>
      <div class="flex flex-col gap-4">
        {#each data.links as link}
          <LinkChecklist {link} />
        {/each}
      </div>
    {:else}
      <div class="text-gray-400">No links found</div>
    {/if}
  </div>
</div>

<style lang="postcss">
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply font-mono text-sm text-gray-400 pl-0.5;
  }
  h3 {
    @apply text-lg text-gray-800;
  }
</style>
