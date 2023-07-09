<script setup lang="ts">

import { computed } from 'vue';
import ProductLogo from './ProductLogo.vue';
import { useBrowserWitdh } from '@/utils/useBrowserWitdh';

const props = defineProps<{
	hideWordmarkWidth: number;
}>();

const browserWidth = useBrowserWitdh();

const showWordmark = computed(() => browserWidth.value > props.hideWordmarkWidth);
</script>

<template>
	<div class="wordmark-container">
		<ProductLogo color="#476C9B" class="logo" />
		<span v-if="showWordmark" class="wordmark">TypeFun</span>
	</div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&display=swap');

.logo {
	width: 40px;
	height: 40px;
}

.wordmark-container {
	display: flex;
	align-items: center;
	gap: 16px;
}

.wordmark {
	font-family: 'Space Mono', monospace;
	color: rgb(var(--v-theme-on-background));
}
</style>
