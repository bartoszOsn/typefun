import '../../../node_modules/typescript/lib/typescriptServices.js'
import { createApp } from 'vue'
import '../style.css'
import ManageScripts from './ManageScripts.vue';
import { vuetifyPlugin } from '@/core//vuetify/vuetifyPlugin';
import { pinia } from '@/core/global-store/pinia';

createApp(ManageScripts)
	.use(vuetifyPlugin)
	.use(pinia)
	.mount('#app')
