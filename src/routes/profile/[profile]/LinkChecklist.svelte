<script lang="ts">
  import { Verified } from 'lucide-svelte';
  import dayjs from 'dayjs';
  import LocalizedFormat from 'dayjs/plugin/localizedFormat';

  import ChecklistItem from './ChecklistItem.svelte';

  dayjs.extend(LocalizedFormat);

  export let link: LinkCheck;

  $: verified = !!link.verified;
</script>

<div class="flex flex-col gap-1 card" class:verified>
  <div class="title">
    <div class="icon"><Verified /></div>
    <div>
      {#if link.verified}Verified!{:else}Not Verified{/if}
    </div>
    {#if link.verified}<div class="grow-1 text-right w-full">
        {dayjs(link.verified).format('lll')}
      </div>{/if}
  </div>
  <div class="body">
    <div>
      <a href={link.url} target="_blank" rel="noreferrer">{link.url}</a>
    </div>
    <div class="flex flex-col gap-1">
      <h5>Checklist</h5>
      <div class="flex flex-col gap-2 ml-2">
        <ChecklistItem value={link.checklist.isHttps} label={'Is the link HTTPS?'} />
        <ChecklistItem
          value={link.checklist.isBodyLessThanOneMegabyte}
          label={'Is the link less than 1MB?'}
        />
        <ChecklistItem
          value={link.checklist.hasProfileLink}
          label={'Does is have the profile link'}
        />
        <ChecklistItem
          value={link.checklist.hasRelMeAttribute}
          label={'Does the profile link have a rel=me attribute'}
        />
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  h5 {
    @apply font-semibold;
  }
  .card {
    @apply rounded border border-gray-500 bg-gray-500 text-gray-100;
  }
  .card > .title {
    @apply px-3 py-2 flex flex-row gap-1;
  }
  .card > .body {
    @apply flex flex-col gap-4 mx-2 mb-2 p-4 rounded bg-gray-100 text-gray-900;
  }

  .icon {
    @apply text-gray-600;
  }

  .verified {
    @apply border-green-500;
  }

  .verified .icon {
    @apply text-gray-100;
  }

  a {
    @apply text-blue-500 underline;
  }
</style>
