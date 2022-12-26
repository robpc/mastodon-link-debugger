<script>
  import '../app.css';
</script>

<div class="flex flex-col gap-8 mx-auto md:max-w-2xl p-4">
  <div>
    <h1>Mastodon Link Debugger</h1>
    <p>
      Link validation requires the coordination between the Mastodon and and the link URL. Use this
      tool to see what issues might be preventing a link from being verified.
    </p>
  </div>
  <hr />
  <slot />
</div>

<style lang="postcss">
  h1 {
    @apply text-2xl font-bold mb-2 text-gray-700;
  }
  hr {
    @apply border-gray-200;
  }
</style>
