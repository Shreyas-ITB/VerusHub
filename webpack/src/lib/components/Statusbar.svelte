<script lang="ts">
	import { fade } from 'svelte/transition';
	import { nodeData, supplyData } from '../stores/data';
	import { onMount } from 'svelte';
	import { getReadableDifficultyString } from '$lib/utils/formats';

	let supply = 0;
	onMount(() => {
		setTimeout(() => {
			supply = parseInt($supplyData.calculatedSupply.toFixed(2)) || 0;
		}, 100);
	});
</script>

<div class="max-w-6xl w-full mx-auto mt-6 px-4 xl:px-2 h-20 pb-32 pt-16 sm:py-36">
	<div>
		<p
			in:fade={{ delay: 500 }}
			class="text-neutral-500 mb-1.5 tracking-tight text-end md:text-start"
		>
			Project Development
		</p>
	</div>
	<div class="w-full h-4 dark:bg-neutral-500 bg-neutral-700 rounded-sm p-0.5">
		<div
			class="relative flex justify-end rounded-sm dark:bg-green-400 bg-blue-400 h-full transition-all ease-in-out duration-1000"
			style="width: 32.2%"
		>
			<p
				class="absolute -top-8 dark:text-white text-neutral-900 w-36 text-end mr-4 font-bold"
				in:fade={{ delay: 150 }}
			>
				<span class="block"
					><span />32.2% Completed
					<span class="absolute mt-1.5 ml-1"> ↴</span></span
				>
			</p>
			<!-- <div class="absolute -top-8 text-white mr-5" /> -->
		</div>
	</div>
	<!-- {#if supply}
		<div
			class="flex justify-between dark:text-white text-neutral-900 mt-4"
			in:fade={{ delay: 500 }}
		>
			<div>
				<p class="font-bold">{($nodeData.tx_count / 1000).toFixed(0)} K</p>
				<p class="text-neutral-500">TRANSACTIONS</p>
			</div>
			<div class="text-center">
				<p class="font-bold">{getReadableDifficultyString($nodeData.difficulty)}</p>
				<p class="text-neutral-500">DIFFICULTY</p>
			</div>
			<div class="text-end">
				<p class="font-bold">{$nodeData.grey_peerlist_size}</p>
				<p class="text-neutral-500">NODES</p>
			</div>
		</div>
	{/if} -->
</div>
