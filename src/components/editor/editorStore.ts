import { writable } from "svelte/store";
import trimEnd from "lodash-es/trimEnd";

const storeCache = new Map();

function getStoreId(pageId: string, id: string) {
  return `${trimEnd(pageId, "/")}__${id}`;
}

const isClient = () => typeof window !== undefined;
const getLocalStorage = () => {
  if (isClient) {
    return window.localStorage;
  }
  return {
    setItem() {},
    getItem() {},
  };
};

export type PageContent = { editorState?: any };

function createEditorStore(pageId: string, id: string) {
  const getPageContent = () => {
    try {
      const stateStr = getLocalStorage().getItem(pageId);
      return stateStr ? JSON.parse(stateStr) : {};
    } catch (e) {}
    return {};
  }
  const save = (editorState: any) => {
    const pageContent = getLocalStorage().getItem(pageId);
    getLocalStorage().setItem(
      pageId,
      JSON.stringify({ ...getPageContent(), [id]: editorState })
    );
  };
  const { subscribe, set, update } = writable(getPageContent()[id]);

  return {
    subscribe,
    setAndSave(editorState: any) {
      set(editorState);
      save(editorState);
    },
  };
}

export function getEditorStore(pageId: string, id: string) {
  const storeId = getStoreId(pageId, id);
  if (!storeCache.has(storeId)) {
    storeCache.set(storeId, createEditorStore(pageId, id));
  }
  return storeCache.get(storeId);
}
