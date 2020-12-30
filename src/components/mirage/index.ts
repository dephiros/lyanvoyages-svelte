import { createServer, Model, Factory } from "miragejs";
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
    models: {
      blogPost: Model,
    },
    factories: {
      blogPost: Factory.extend({
        html: () => {
          return faker.fake(`<p>{{lorem.paragraph}}</p>`);
        },
        slug: () => {
          return faker.lorem.slug();
        },
      }),
    },
    routes() {
      this.get("/api/blog-posts", (schema) => schema.blogPosts.all());
      this.get("/api/blog-posts/:id", (schema, request) =>
        schema.blogPosts.findBy({ slug: request.params.id })
      );
    },
    seeds(server) {
      server.create("blogPost", { slug: "test" });
      server.createList("blogPost", 10);
    },
  });
}
