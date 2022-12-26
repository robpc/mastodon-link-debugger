<script lang="ts">
  import type { PageData } from './$types';
  import LinkChecklist from './LinkChecklist.svelte';

  export let data: PageData;
</script>

<div class="flex flex-col gap-10">
  <div class="flex flex-col gap-1">
    <h2>{data.profile}</h2>
    <h1>{data.name}</h1>
  </div>
  <div class="flex flex-col gap-5">
    <h3>Links</h3>
    {#each data.links as link}
      <LinkChecklist {link} />
    {/each}
  </div>
</div>
