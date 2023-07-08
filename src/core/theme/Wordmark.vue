<script setup lang="ts">

import Logo from './Logo.vue';
import { useBrowserWitdh } from '@/utils/useBrowserWitdh';
import { computed } from 'vue';

const props = defineProps<{
	hideWordmarkWidth: number;
}>();

const browserWidth = useBrowserWitdh();

const showWordmark = computed(() => browserWidth.value > props.hideWordmarkWidth);
</script>

<template>
	<div class="wordmark-container">
		<Logo color="#476C9B" class="logo" />
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