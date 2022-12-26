<script lang="ts">
  import { CheckCircle, XOctagon } from 'lucide-svelte';

  export let value: boolean;
  export let label: string;
</script>

<div class="flex flex-row gap-1 items-center text-sm">
  {#if value}
    <CheckCircle class="text-green-500" />
  {:else}
    <XOctagon class="text-red-500" />
  {/if}
  <div>{label}</div>
</div>
