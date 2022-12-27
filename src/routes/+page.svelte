<script lang="ts">
  let profile: string;
  let error = false;

  let handle: string;

  function validate() {
    handle = '';
    error = false;

    if (!profile) return;

    if (profile.startsWith('http')) {
      const [domain, username] = profile.replace(/https?\:\/\//, '').split('/', 2);

      handle = `@${username}@${domain}`;
    } else if (profile.includes('@')) {
      const [username, domain] = profile.replace(/^@?/, '').split('@', 2);

      handle = `@${username}@${domain}`;

      handle = profile;
    } else {
      error = true;
    }
  }

  const examples = [
    '@robpc@indieweb.social',
    '@Mastodon@mastodon.social',
    '@ludumdare@jammer.social',
    '@drewharwell@mastodon.social'
  ];
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-row items-center gap-2">
    <label for="profile">Mastodon profile:</label>
    <input
      class="grow"
      type="text"
      id="profile"
      name="profile"
      bind:value={profile}
      on:blur={validate}
    />
    <a class:hidden={!handle} class="btn" href="./profile/{handle}">Go</a>
    <div class:hidden={handle} class="btn btn-disabled">Go</div>
  </div>
  <div class:hidden={!error} class="error">
    Does not match the profile <code>@name@example.social</code> or url
    <code>https://example.social/@name</code> format
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
    @apply text-xs text-yellow-700;
  }
  .error > code {
    @apply px-1 py-0.5 rounded font-mono text-yellow-600 bg-yellow-100;
  }
</style>
