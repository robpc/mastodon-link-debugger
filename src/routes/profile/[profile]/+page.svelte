<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="flex flex-col gap-1">
  <h2>{data.profile}</h2>
  <h1>{data.name}</h1>
  <div class="flex flex-col gap-1">
    {#each data.links as link}
      <div class="flex flex-col gap-0.5">
        {#if link.verified}Verified!{:else}Not Verified{/if}
        <code>{link.url}</code>
        <code>{link.verified}</code>
      </div>
    {/each}
  </div>
</div>
