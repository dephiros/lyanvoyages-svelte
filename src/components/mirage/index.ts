import { createServer, Model, Factory } from "miragejs"
import faker from 'faker';

declare global {
    interface Window { server: any; }
}


export function initServer () {
  if (window.server) {
    window.server.shutdown()
  }
  window.server = createServer({
    models: {
      blogPost: Model
    },
    factories: {
      blogPost: Factory.extend({
        html: () => {
          return faker.fake(`<p>{{lorem.paragraph}}</p>`);
        },
      }),
    },
    routes() {
      this.get("/api/blog-post", (schema) => schema.blogPosts.all());
    },
    seeds(server) {
      server.createList("blogPost", 10);
    } 
  });
};
