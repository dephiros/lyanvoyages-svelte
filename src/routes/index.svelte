<script type='ts'>
  import { onMount } from 'svelte';
  import Counter from "$components/Counter.svelte";
  import Editor from "$components/editor";
  import { initServer } from '$components/mirage';

  let blogPosts = [];

  onMount(async () => {
    initServer();
    const response = await fetch('/api/blog-posts');
    const body = await response.json();
    blogPosts = body.blogPosts;
  });

  

</script>

<style>
</style>

<Editor contentId="content" />
<main class="text-center p-4 mx-0 my-auto">
  <h1 class="text-red-600">Hello world!</h1>

  <Counter />
  <p class="text-red-600">
    Visit the
    <a href="https://svelte.dev">svelte.dev</a>
    to learn how to build Svelte apps.
  </p>
  <div id="content">
    {#if blogPosts.length}
      {@html blogPosts[0].html}
    {/if}
  </div>
  <h2>Blog Post</h2>
  {#each blogPosts as blogPost}
    {@html blogPost.html}
  {/each}
</main>
