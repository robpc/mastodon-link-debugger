<script>
  import '../app.css';
</script>

<div class="flex flex-col gap-8 mx-auto md:max-w-2xl p-4">
  <div>
    <h1 class="text-3xl font-bold">Mastodon Link Debugger</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Massa sapien faucibus et molestie. Sed id semper risus in.
      Ipsum suspendisse ultrices gravida dictum fusce. Placerat in egestas erat imperdiet sed
      euismod nisi porta.
    </p>
  </div>
  <hr />
  <slot />
</div>

<style lang="postcss">
  hr {
    @apply border-gray-200;
  }
</style>
