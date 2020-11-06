<script lang="ts">
  import { onMount } from "svelte";

  import { baseKeymap } from "prosemirror-commands";
  import { EditorState } from "prosemirror-state";
  import { EditorView } from "prosemirror-view";
  import { keymap } from "prosemirror-keymap";
  import { Schema, DOMParser } from "prosemirror-model";
  import { schema as basicSchema } from "prosemirror-schema-basic";
  import { addListNodes } from "prosemirror-schema-list";
  // import { exampleSetup } from "prosemirror-example-setup";

  import EditorMenu from "./EditorMenu.svelte";
  import { buildKeymap } from "./keymap";

  let editorElement;
  let editorView;

  // TODO: set up inputrules to enable typing ```
  // See https://github.com/ProseMirror/prosemirror-example-setup/blob/90e380f3640dcf9c5961b0285d47012ccf3d640b/src/inputrules.js#L23

  onMount(() => {
    const schema = new Schema({
      nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block"),
      marks: basicSchema.spec.marks
    });

    editorView = new EditorView(editorElement, {
      state: EditorState.create({
        doc: DOMParser.fromSchema(schema).parse(
          document.querySelector("#content")
        ),
        plugins: [keymap(buildKeymap(schema), null), keymap(baseKeymap)]
      })
    });
  });
</script>

<div bind:this={editorElement} />
<div id="content" />
<EditorMenu />
