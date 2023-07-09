import { createApp } from 'vue'
import '../style.css'
import ManageScripts from './ManageScripts.vue';
import { vuetifyPlugin } from '@/core//theme/vuetifyPlugin';
import { pinia } from '@/core/global-store/pinia';

createApp(ManageScripts)
	.use(vuetifyPlugin)
	.use(pinia)
	.mount('#app')
