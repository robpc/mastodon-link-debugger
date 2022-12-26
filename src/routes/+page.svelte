<script lang="ts">
  let profile: string;
  let error = false;
  let invalid = true;

  let handle: string;

  function validate() {
    handle = '';
    error = false;

    if (profile.startsWith('http')) {
      const [domain, username] = profile.replace(/https?\:\/\//, '').split('/', 2);

      handle = `@${username}@${domain}`;

      invalid = false;
    } else if (profile.includes('@')) {
      const [username, domain] = profile.replace(/^@?/, '').split('@', 2);

      handle = `@${username}@${domain}`;

      handle = profile;
      invalid = false;
    } else {
      error = true;
    }
  }
</script>

<div class="flex flex-col gap-0.5">
  <div class="flex flex-row items-center gap-1">
    <label for="profile">Mastodon profile:</label>
    <input
      class="grow"
      type="text"
      id="profile"
      name="profile"
      bind:value={profile}
      on:blur={validate}
    />
    <a class:hidden={!handle} href="./profile/{handle}">Go</a>
    <div class:hidden={handle} class="a-disabled">Go</div>
  </div>
  <div class:hidden={!error} class="error">
    Does not match the profile <code>@name@example.social</code> or url
    <code>https://example.social/@name</code> format
  </div>
</div>

<style lang="postcss">
  a {
    @apply px-4 py-2 rounded bg-blue-100 border border-blue-600 text-blue-800;
  }
  a:hover {
    @apply border-blue-600 bg-blue-600 text-white;
  }

  .a-disabled {
    @apply px-4 py-2 rounded bg-gray-100 border border-gray-100 text-gray-800;
  }

  input {
    @apply px-2 py-2 rounded bg-blue-50 border border-blue-600;
  }

  .error {
    @apply text-xs font-bold text-red-500;
  }
  .error > code {
    @apply px-1 py-0.5 rounded font-mono text-red-600 bg-red-100;
  }
</style>
