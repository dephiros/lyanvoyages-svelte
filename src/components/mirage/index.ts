import { createServer, Model, Factory, trait, Response } from "miragejs";
import faker from "faker";
import trim from "lodash-es/trim";

const store = new Map();

declare global {
  interface Window {
    server: any;
  }
}

function getFileKey(path) {
  return `file:/${trim(path, "/")}`;
}

function createFile(path, file) {
  store.set(getFileKey(path), file);
  return file;
}

function updateDir(path, files = []) {
  const dirKey = getFileKey(path);
  const directory = store.get(dirKey) || { children: [] };
  directory.children = [...directory.children, ...files];
  store.set(dirKey, directory);
  return directory;
}

function getDirPathFromFilePath(filePath) {
  const parts = filePath.split("/");
  return ["", ...parts.slice(0, -1)].join("/");
}

export function initServer() {
  if (window.server) {
    window.server.shutdown();
  }
  window.server = createServer({
    // TODO figure serializer for file
    models: {},
    factories: {},
    routes() {
      this.get("/api/blog", (schema, request) => {
        const { children: blogPosts = [] } =
          store.get(getFileKey("blog")) || {};
        return blogPosts.map((filePath) =>
          store.get(getFileKey(`/blog/${filePath}`))
        );
      });
      this.get("/api/:id", (schema, request) => {
        const file = store.get(getFileKey(request.params.id));
        if (!file) return new Response(404, {}, {});
        return file;
      });
      // TODO endpoint for creating a file
      this.post("api/:id", (schema, request) => {
        const { content } = JSON.parse(request.requestBody);
        const filePath = request.params.id;
        const file = createFile(filePath, { content });
        const dirPath = getDirPathFromFilePath(filePath);
        updateDir(dirPath, [file]);
        return file;
      });
    },
    seeds(server) {
      const blogSlugs = [
        "test",
        faker.lorem.slug(),
        faker.lorem.slug(),
        faker.lorem.slug(),
      ];
      const files = blogSlugs.map((slug) =>
        createFile(`/blog/${slug}`, {
          slug,
          content: {
            "#content": {
              html: faker.fake(`<p>{{lorem.paragraph}}</p>`),
            },
          },
        })
      );
      updateDir("/blog", blogSlugs);
      console.log(store, "STORE");
    },
  });
}
