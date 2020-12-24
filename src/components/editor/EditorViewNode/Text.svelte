<script type="ts">
import type { Node as EditorNode } from 'prosemirror-model';

  const SUPPORTED_MARKS = new Map(Object.entries({
    text: Text
  }));
  export let node: EditorNode;
</script>

{#if node.}
{node.text}