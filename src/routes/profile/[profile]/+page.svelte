<script lang="ts">
  import type { PageData } from './$types';
  import LinkChecklist from './LinkChecklist.svelte';

  export let data: PageData;
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-0">
    <h2>{data.profile}</h2>
    <h1>{data.name}</h1>
  </div>
  <div class="flex flex-col gap-1">
    <h3>Link Verification</h3>
    <div class="flex flex-col gap-4">
      {#each data.links as link}
        <LinkChecklist {link} />
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply font-mono text-sm text-gray-500;
  }
  h3 {
    @apply text-lg text-gray-800;
  }
</style>
