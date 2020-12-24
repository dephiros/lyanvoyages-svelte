<script lang="ts">
  export let content = [];

</script>

{#each content as block}
  {#if block.type === 'paragraph'}

  {:else if block.type === 'text'}

  {/if}
{/each}