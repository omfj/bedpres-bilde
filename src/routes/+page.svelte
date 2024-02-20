<script lang="ts">
	let image = $state<Blob>();
	let loading = $state(false);

	let color = $state('#ffffff');

	const handleSubmit = async (
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		loading = true;
		image = undefined;

		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const response = await fetch('/upload', {
			method: 'POST',
			body: formData
		});

		// Get the image from the response
		image = await response.blob();
		loading = false;
	};
</script>

<div class="max-w-6xl mx-auto">
	<div class="m-4 p-4 bg-gray-200 border shadow rounded-xl space-y-4">
		<h1 class="text-2xl font-bold">Last opp logo til selskapet</h1>

		<p>
			Last opp et bilde, og det vil bli transformert til et passende format til bruk på nettsiden.
		</p>

		<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
			<input type="file" name="file" />
			<input type="color" name="color" bind:value={color} />
			<button class="bg-blue-400 p-2" type="submit">Last opp</button>
		</form>

		{#if loading}
			<p>Laster opp...</p>
		{/if}

		{#if image && !loading}
			<img src={URL.createObjectURL(image)} alt="Uploaded image" class="h-96 w-96" />

			<p>
				<a href={URL.createObjectURL(image)} download="logo.png">Last ned</a>
			</p>
		{/if}
	</div>
</div>
