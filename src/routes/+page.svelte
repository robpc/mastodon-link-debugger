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

<h1 class="text-3xl font-bold">Hello world!</h1>
<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua. Massa sapien faucibus et molestie. Sed id semper risus in. Ipsum
  suspendisse ultrices gravida dictum fusce. Placerat in egestas erat imperdiet sed euismod nisi
  porta. Massa eget egestas purus viverra accumsan in nisl. Ut sem viverra aliquet eget sit amet
  tellus cras. Quam adipiscing vitae proin sagittis. Dignissim sodales ut eu sem. Potenti nullam ac
  tortor vitae purus faucibus ornare. Sed lectus vestibulum mattis ullamcorper. Massa tempor nec
  feugiat nisl pretium fusce id velit ut. Facilisi cras fermentum odio eu feugiat pretium. Gravida
  quis blandit turpis cursus in hac. Nisl rhoncus mattis rhoncus urna. Vitae congue mauris rhoncus
  aenean vel elit. Convallis convallis tellus id interdum. Libero enim sed faucibus turpis in eu mi.
  Gravida in fermentum et sollicitudin ac orci phasellus egestas tellus. Volutpat maecenas volutpat
  blandit aliquam etiam erat velit.
</p>
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
