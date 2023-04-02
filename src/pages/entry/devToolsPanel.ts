import '../../../node_modules/typescript/lib/typescriptServices.js'
import { createApp } from 'vue'
import '../style.css'
import DevToolsPanel from '../root/DevToolsPanel.vue'
import { vuetifyPlugin } from '@/core//vuetify/vuetifyPlugin';
import { snackbarManagerPlugin } from '@/core/snackbar-manager/snackbarManagerPlugin';
import { pinia } from '@/core/global-store/pinia';

createApp(DevToolsPanel)
	.use(vuetifyPlugin)
	.use(snackbarManagerPlugin)
	.use(pinia)
	.mount('#app')
