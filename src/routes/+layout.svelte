<script lang="ts">
  import '../app.css';

  import { fade } from 'svelte/transition';
  import { Jumper } from 'svelte-loading-spinners';
  import { page } from '$app/stores';
  import { browser, dev } from '$app/environment';
  import { navigationIsDelayed } from '$lib/store';

  $: if (browser) {
    import('@vercel/analytics').then(
      ({ inject }) => inject({ mode: dev ? 'development' : 'production' }),
      (err) => console.log('Unable to load Vercel Analytics', err)
    );
  }

  let analyticsId = import.meta.env.VERCEL_ANALYTICS_ID;
  $: if (browser && analyticsId) {
    import('$lib/vitals').then(({ webVitals }) =>
      webVitals({
        path: $page.url.pathname,
        params: $page.params,
        analyticsId
      })
    );
  }
</script>

<svelte:head>
  <title>Mastodon Link Debugger</title>
</svelte:head>

<div class="flex flex-col gap-8 mx-auto md:max-w-2xl p-4">
  <div>
    <h1>Mastodon Link Debugger</h1>
    <p>
      Link validation requires the coordination between the Mastodon and and the link URL. Use this
      tool to see what issues might be preventing a link from being verified.
    </p>
  </div>
  <hr />
  {#if $navigationIsDelayed}
    <div class="flex justify-center items-center text-gray-600 py-16" in:fade={{ duration: 150 }}>
      <Jumper color="#9E9E9E" />
    </div>
  {:else}
    <slot />
  {/if}
  <div class="flex flex-col gap-1">
    <hr />
    <div class="flex flex-row gap-2 justify-center text-xs text-gray-400">
      <div>
        Created by <a href="https://indieweb.social/@robpc" target="_blank" rel="me noreferrer"
          >@robpc</a
        >
      </div>
      <div>•</div>
      <div>
        Source on <a
          href="https://github.com/robpc/mastodon-link-debugger"
          target="_blank"
          rel="noreferrer">Github</a
        >
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  h1 {
    @apply text-2xl font-bold mb-2 text-gray-700;
  }
  hr {
    @apply border-gray-200;
  }
</style>
