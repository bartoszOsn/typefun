import '../../../node_modules/typescript/lib/typescriptServices.js'
import { createApp } from 'vue'
import '../style.css'
import { vuetify } from '../plugins/vuetify';
import ManageScripts from '../root/ManageScripts.vue';
import { pinia } from '@/core/global-store/pinia';

createApp(ManageScripts)
	.use(vuetify)
	.use(pinia)
	.mount('#app')
