import { computed, onBeforeUnmount, ref, Ref } from 'vue';

export function useBrowserWitdh(): Ref<number> {
	const width = ref(window.innerWidth);

	function handleResize() {
		width.value = window.innerWidth;
	}

	window.addEventListener('resize', handleResize);

	onBeforeUnmount(() => {
		window.removeEventListener('resize', handleResize);
	});


	return computed(() => width.value); // computed so it doesn't have setter.
}