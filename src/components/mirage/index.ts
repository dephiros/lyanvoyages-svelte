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
      directory: Model,
      tag: Model,
    },
    identityManagers: {
      // TODO implement an identify manager https://miragejs.com/docs/advanced/mocking-guids/
      // do we need to or can we just override id?
    },
    factories: {
      file: Factory.extend({
        blogPost: trait({
          html: () => {
            return faker.fake(`<p>{{lorem.paragraph}}</p>`);
          },
          slug: () => {
            return faker.lorem.slug();
          },
          id: () => {
            return `blog-post/${this.slug}`
          }
        }),
      }),
    },
    routes() {
      // TODO create endpoint for file and directory here
      // TODO endpoint for creating a file
      this.get("/api/blog-posts", (schema) => schema.blogPosts.all());
      this.get("/api/blog-posts/:id", (schema, request) =>
        schema.blogPosts.findBy({ slug: request.params.id })
      );
    },
    seeds(server) {
      // TODO add seed for file and directory here. We can even create directory using after create
    },
  });
}
