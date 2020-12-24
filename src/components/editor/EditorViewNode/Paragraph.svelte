<script type="ts">
import type { Node as EditorNode } from 'prosemirror-model';
import type { get } from 'svelte/store';
import Text from './Text.svelte';

  const SUPPORTED_NODES = new Map(Object.entries({
    text: Text
  }));
  export let node: EditorNode;
  const content = node?.content || [];
</script>

{#each content as node}
  <svelte:component this={SUPPORTED_NODES.get(node.type)} />
{/each}

