<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;

  const examples = [
    '@robpc@indieweb.social',
    '@Mastodon@mastodon.social',
    '@ludumdare@jammer.social',
    '@drewharwell@mastodon.social',
    '@molly0xfff@hachyderm.io'
  ];
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-1">
    <form method="POST" class="flex flex-row items-center gap-2" use:enhance>
      <input
        class="grow"
        type="text"
        id="profile"
        name="profile"
        placeholder="Enter a profile (ex. @user@my.social or https://my.social/@user)"
        value={form?.profile ?? ''}
      />
      <button>Go</button>
    </form>
    {#if form?.empty || form?.invalid}
      <div class="error">
        Input should match the profile <code>@name@example.social</code> or url
        <code>https://example.social/@name</code> format
      </div>
    {/if}
  </div>
  <div class="flex flex-col gap-1">
    <h2>Examples</h2>
    {#each examples as profile}
      <div><a href="./profile/{profile}">{profile}</a></div>
    {/each}
  </div>
</div>

<style lang="postcss">
  h2 {
    @apply text-sm font-semibold text-gray-500;
  }
  input {
    @apply px-2 py-2 rounded bg-blue-50 border border-blue-600;
  }

  .error {
    @apply text-xs text-gray-500;
  }
  .error > code {
    @apply px-1 py-0.5 rounded font-mono text-yellow-600 bg-yellow-100;
  }
</style>
