<script lang="ts">
  import { CheckCircle, XOctagon, PauseOctagon } from 'lucide-svelte';

  export let value: boolean | null;
  export let label: string;
</script>

<div class="flex flex-row gap-1 items-center text-sm">
  {#if value}
    <CheckCircle class="text-green-500" />
  {:else if value === false}
    <XOctagon class="text-red-500" />
  {:else}
    <PauseOctagon class="text-gray-400" />
  {/if}
  <div>{label}</div>
</div>
