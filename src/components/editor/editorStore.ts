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
  const { subscribe, set, update } = writable("");
  const getPageContent = async () => {
    try {
      const response = await fetch(`/api${pageId}`);
      set((await response.json())[id] || {});

    } catch (e) {
      console.log(e);
    }
  }
  const save = (content: any) => {
    fetch(`/api${pageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({[id]: content})
    });
  };

  getPageContent();

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
