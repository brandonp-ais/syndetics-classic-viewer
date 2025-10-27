<script lang="ts">
	// CORS WARNING: The API does not allow browser requests. For local development, set up a Vite proxy in vite.config.ts:
	//   server: { proxy: { '/api': { target: 'https://titlepeek.follettsoftware.com', changeOrigin: true, rewrite: path => path.replace(/^\/api/, '') } } }
	// Then, use '/api/v4/details/{isbn}?customerNumber=9610465' as the URL below.
	// const base_url = '/api/v4/details/{isbn}?customerNumber=9610465';
	const base_url = 'http://titlepeek.follettsoftware.com/v4/details/{isbn}?customerNumber=9610465';

	let isbn = '9780590353427';
	let loading = false;
	let error: string | null = null;
	let result: any = null;

	async function search() {
		error = null;
		result = null;
		if (!isbn) {
			error = 'Please enter an ISBN.';
			return;
		}
		loading = true;
		try {
			const res = await fetch('/api/search', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isbn })
			});
			const data = await res.json();
			if (!res.ok || data.error) throw new Error(data.error || 'Failed to fetch data');
			result = data.result;
		} catch (e: any) {
			error = e.message || 'Unknown error';
		} finally {
			loading = false;
		}
	}

	// Recursive display function
	function renderJson(data: any): string {
		if (data === null) return '<span class="text-gray-400">null</span>';
		if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
			return `<span class='text-blue-700'>${String(data)}</span>`;
		}
		if (Array.isArray(data)) {
			return `<ul class='ml-4 list-disc'>${data.map((item, i) => `<li><span class='text-xs text-gray-500'>[${i}]</span>: ${renderJson(item)}</li>`).join('')}</ul>`;
		}
		if (typeof data === 'object') {
			return `<ul class='ml-4 border-l-2 border-gray-200 pl-2'>${Object.entries(data)
				.map(
					([key, value]) =>
						`<li><span class='font-semibold text-gray-800'>${key}</span>: ${renderJson(value)}</li>`
				)
				.join('')}</ul>`;
		}
		return '<span class="text-red-500">Unknown</span>';
	}

	// ISBNS for testing
	// 9780134190440
	// 9780134190441
	// 9780134190442
	// 9780134190443
</script>

<div class="mx-auto mt-8 max-w-2xl rounded-lg bg-white p-6 shadow">
	<h1 class="mb-6 text-2xl font-bold text-gray-800">Syndetics Classic Viewer</h1>
	<form class="mb-6 flex gap-2" on:submit|preventDefault={search}>
		<input
			type="text"
			bind:value={isbn}
			placeholder="Enter ISBN"
			class="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-400 focus:ring focus:outline-none"
		/>
		<button
			type="submit"
			class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
			disabled={loading}
		>
			Search
		</button>
	</form>

	{#if loading}
		<div class="flex items-center gap-2 text-blue-600">
			<svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24"
				><circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
					fill="none"
				/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg
			> Loading...
		</div>
	{/if}
	{#if error}
		<div class="mb-2 font-semibold text-red-600">{error}</div>
	{/if}
	{#if result}
		<h2 class="mt-6 mb-2 text-lg font-bold text-gray-700">Result</h2>
		<div class="overflow-x-auto rounded bg-gray-50 p-4">
			{@html renderJson(result)}
		</div>
	{/if}
</div>
