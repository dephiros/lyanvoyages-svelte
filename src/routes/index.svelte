<script type="ts">
  import { onMount } from "svelte";
  import Counter from "$components/Counter.svelte";
  import Editor from "$components/editor";
  import { initServer } from "$components/mirage";

  let blogPosts = [];
  let serverInit = false;

  onMount(async () => {
    initServer();
    serverInit = true;
    const response = await fetch("/api/blog/");
    const body = await response.json();
    blogPosts = body;
  });
</script>

<style>
</style>

{#if serverInit}
  <Editor contentId="content" />
{/if}
<main class="text-center p-4 mx-0 my-auto">
  <h1 class="text-red-600">Hello world!</h1>
  <Counter />
  <p class="text-red-600">
    Visit the
    <a href="https://svelte.dev">svelte.dev</a>
    to learn how to build Svelte apps.
  </p>
  <h2 class="text-2xl">Blog Post</h2>
  {#each blogPosts as blogPost}
    <h2 class="font-bold text-xl">{blogPost.slug}</h2>
    {@html blogPost.content['#content'].html}
  {/each}
</main>
