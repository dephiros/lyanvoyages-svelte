<script lang="ts">
  import { onMount } from "svelte";

  import { history } from "prosemirror-history";
  import { baseKeymap } from "prosemirror-commands";
  import { dropCursor } from "prosemirror-dropcursor";
  import { gapCursor } from "prosemirror-gapcursor";
  import { EditorState, Plugin } from "prosemirror-state";
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
  const isClient = () => typeof window !== undefined;
  const getLocalStorage = () => {
    if (isClient) {
      console.log('hello')
      return window.localStorage;
    }
    return {
      setItem() {},
      getItem() {}
    };
  };

  // TODO: set up inputrules to enable typing ```
  // See https://github.com/ProseMirror/prosemirror-example-setup/blob/90e380f3640dcf9c5961b0285d47012ccf3d640b/src/inputrules.js#L23
  const store = {
    EDITOR_STATE: "editor_state",
    get state() {
      try {
        const stateStr = getLocalStorage().getItem(this.EDITOR_STATE);
        return stateStr && JSON.parse(stateStr);
      } catch (e) {
        return null;
      }
    },
    set state(state) {
      getLocalStorage().setItem(this.EDITOR_STATE, JSON.stringify(state));
    }
  };

  onMount(() => {
    const schema = new Schema({
      nodes: addListNodes(basicSchema.spec.nodes as any, "paragraph block*", "block"),
      marks: basicSchema.spec.marks
    });
    const plugins = [
      keymap(buildKeymap(schema), null),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
      history(),
      new Plugin({
        // https://prosemirror.net/docs/ref/#view.EditorProps
        props: {
          attributes: { class: "prose prose-lg" },
          handleTextInput(
            view: EditorView,
            from: number,
            to: number,
            text: string
          ) {
            const state = view.state.toJSON();
            console.log(
              `text: ${text}
                state:`,
              JSON.stringify(state)
            );
            store.state = state;
            return false;
          }
        }
      })
    ];
    editorView = new EditorView(editorElement, {
      // state: EditorState.create({
      //   doc: DOMParser.fromSchema(schema).parse(
      //     document.querySelector("#content")
      //   ),
      //   plugins
      // })
      state: store.state
        ? EditorState.fromJSON({ schema, plugins }, store.state)
        : EditorState.create({ schema, plugins })
    });
  });
</script>

<div bind:this={editorElement} />
<div id="content" />
<EditorMenu />
