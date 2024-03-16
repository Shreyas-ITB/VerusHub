<script lang="ts">
	import Card from './Card.svelte';
	import { supplyData } from '$lib/stores/data';
	import { numberWithCommas } from '$lib/utils/formats';

	const content = [
		{
			title: 'P2P',
			text: `<span class="dark:text-neutral-100 text-neutral-900">Client-to-Client</span> based communication makes everything 100x times secure and private that you dont even need a password to login!`
		},
		{
			title: 'Transfers',
			text: "You would be able to tip or donate VerusCoin to the members you like to, without the need of any plugin or a bot."
		},
		{
		title: 'Encryption',
		text: "VerusHub cares a lot about your privacy, it keeps the messages encrypted before sending it to the client/person even though its based on p2p network, Which offers an added security to your data."
		},
		{
		title: 'Untraceable',
		text: "Since we are based on blockchain, you stay completely anonymous and untraceable. No one knows who you are or where you are from."
		},
		{
		title: 'Unlimited scaled uploads',
		text: "The documents you upload will be stored on the blockchain forever, and you don't have to worry about the size of the document you upload. Because size doesn't matter!"
		},
		{
		title: 'Drama-free',
		text: "We are completely open-sourced and free to use. You can download the code and customise it as per your needs, or contribute to make the experience even better."
		},
		];
</script>

<div class="max-w-6xl mx-auto px-4 xl:px-2 pb-16 sm:pb-20">
	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each content ?? [] as item}
			<Card data={item} />
		{/each}
	</div>
</div>
