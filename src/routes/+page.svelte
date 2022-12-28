<script lang="ts">
  let profile: string;
  let error = false;

  let handle: string;

  function validate() {
    handle = '';
    error = false;

    if (!profile) return;

    const httpRex = /https?\:\/\/.+\/@.+/;
    const usernameRex = /@.+@.+/;
    if (httpRex.test(profile)) {
      const [domain, username] = profile.replace(/https?\:\/\//, '').split('/', 2);

      handle = `@${username}@${domain}`;
    } else if (usernameRex.test(profile)) {
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
    '@drewharwell@mastodon.social',
    '@molly0xfff@hachyderm.io'
  ];

  const debounce = (inputFunction: () => void, timeToWaitBeforeFiringInMs = 500) => {
    let timer: NodeJS.Timeout;
    return (...args: []) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // @ts-ignore
        inputFunction.apply(this, args);
      }, timeToWaitBeforeFiringInMs);
    };
  };

  let go: HTMLAnchorElement;

  const handleKeyup = debounce(validate, 500);
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      validate();
      go.click();
    }
  };
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-1">
    <div class="flex flex-row items-center gap-2">
      <input
        class="grow"
        type="text"
        id="profile"
        name="profile"
        placeholder="Enter a profile (ex. @user@my.social or https://my.social/@user)"
        bind:value={profile}
        on:blur={validate}
        on:keyup={handleKeyup}
        on:keydown={handleKeydown}
      />
      <a bind:this={go} class:hidden={!handle} class="btn" href="./profile/{handle}">Go</a>
      <div class:hidden={handle} class="btn btn-disabled">Go</div>
    </div>
    <div class:hidden={!error} class="error">
      Input should match the profile <code>@name@example.social</code> or url
      <code>https://example.social/@name</code> format
    </div>
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
