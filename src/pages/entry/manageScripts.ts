import '../../../node_modules/typescript/lib/typescriptServices.js'
import { createApp } from 'vue'
import '../style.css'
import { vuetifyPlugin } from '@/core//vuetify/vuetifyPlugin';
import ManageScripts from '../root/ManageScripts.vue';
import { pinia } from '@/core/global-store/pinia';

createApp(ManageScripts)
	.use(vuetifyPlugin)
	.use(pinia)
	.mount('#app')
