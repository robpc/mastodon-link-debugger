<script lang="ts">
  import { Verified, Link2, Link2Off } from 'lucide-svelte';
  import dayjs from 'dayjs';
  import LocalizedFormat from 'dayjs/plugin/localizedFormat';

  import ChecklistItem from './ChecklistItem.svelte';

  dayjs.extend(LocalizedFormat);

  export let link: LinkCheck;

  $: verified = !!link.verified;
</script>

<div class="card" class:verified>
  <div class="title">
    {#if !link.isVerifiable}
      <div class="icon"><Link2Off /></div>
      <div>Not a link</div>
    {:else if link.verified}
      <div class="icon"><Verified /></div>
      <div>Verified!</div>
      <div class="grow-1 text-right w-full">
        {dayjs(link.verified).format('lll')}
      </div>
    {:else}
      <div class="icon"><Link2 /></div>
      <div>Not Verified</div>
    {/if}
  </div>
  <div class="body">
    <div>
      {#if link.isVerifiable}
        <a href={link.url} target="_blank" rel="noreferrer">{link.url}</a>
      {:else}
        <div class="overflow-hidden overflow-ellipsis">{link.url}</div>
      {/if}
    </div>
    {#if link.checklist}
      <div class="flex flex-col gap-1">
        <h5>Checklist</h5>
        <div class="flex flex-col gap-2 ml-2">
          {#if link.verified && !link.allPassed}
            <div class="text-xs text-gray-600">
              Note: This link is verified but not currently passing all checks. It might not
              reverify next time the profile is saved and might appear unverified on some instances.
            </div>
          {/if}
          {#if !link.verified && link.allPassed}
            <div class="text-xs text-gray-600">
              Note: This link is not verified but appears to pass all checks. The profile owner
              should resave their profile. If that does not verify the link please report a bug to <a
                href="https://indieweb.social/@robpc">@robpc</a
              >.
            </div>
          {/if}
          {#if link.allPassed}
            <ChecklistItem value={link.allPassed} label={'This link has passed all checks'} />
          {:else}
            <ChecklistItem value={link.checklist.isHttps} label={'Is the link HTTPS?'} />
            <ChecklistItem
              value={link.checklist.isSuccessful}
              label={'Did the link response succeed?'}
            />
            <ChecklistItem
              value={link.checklist.isLessThanFiveSeconds}
              label={'Is the link response less than five seconds?'}
            />
            <ChecklistItem
              value={link.checklist.hasProfileLink}
              label={'Is there a link back to the profile?'}
            />
            <ChecklistItem
              value={link.checklist.hasRelMeAttribute}
              label={'Is there a link back to the profile with a rel=me attribute?'}
            />
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  h5 {
    @apply font-semibold;
  }
  .card {
    @apply flex flex-col gap-2 p-2 rounded bg-gray-400 text-gray-100;
  }
  .card.verified {
    @apply bg-green-500;
  }

  .card > .title {
    @apply px-1 flex flex-row items-center gap-1;
  }
  .card > .body {
    @apply flex flex-col gap-4 p-4 rounded bg-gray-100 text-gray-900;
  }

  .icon {
    @apply text-gray-500;
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
