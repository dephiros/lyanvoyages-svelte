import { createServer, Model, Factory, trait } from "miragejs";
import faker from "faker";

declare global {
  interface Window {
    server: any;
  }
}

export function initServer() {
  if (window.server) {
    window.server.shutdown();
  }
  window.server = createServer({
    // TODO figure serializer for file
    models: {
      file: Model,
      tag: Model,
    },
    factories: {
      file: Factory.extend({
        directory: trait({
          type: "directory"
        }),
        file: trait({
          type: "file"
        }),
        slug: () => {
          return faker.lorem.slug();
        },
        blogPost: trait({
          "content": () => ( {
            "#content": {
              html: faker.fake(`<p>{{lorem.paragraph}}</p>`)
            }
          } )
        }),
      })
    },
    routes() {
      this.get("/api/:id", (schema, request) => {
        return schema.files.findBy({ slug: request.params.id })
      });
      // TODO endpoint for creating a file
      this.post("api/:id", (schema, request) => {
        const { content } = JSON.parse(request.requestBody)
        const path = request.params.id;
        const parts = path.split("/");
        const name = parts.pop();
        const dir = [""].concat(parts).join('/');
        const newFile = schema.files.create({id: request.params.id, content});
        const directory = schema.files.findOrCreateBy({ id: dir});
        directory.children[name] = { id: path };
        return newFile;
      },
    },
    seeds(server) {
      // TODO add seed for file and directory here. We can even create directory using after create
    },
  });
}
