<script>
  import Counter from "$components/Counter.svelte";
  import Editor from "$components/editor";
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
  <div id="content" />
</main>
