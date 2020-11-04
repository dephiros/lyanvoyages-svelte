<script lang="ts">
	let count: number = 0;

	const increment = () => {
		count += 1;
	};
</script>

<button on:click={increment} type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
	Button text
	Clicks: {count}
</button>

<style>
</style>