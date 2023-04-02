import '../../../node_modules/typescript/lib/typescriptServices.js'
import { createApp } from 'vue'
import '../style.css'
import DevToolsPanel from '../root/DevToolsPanel.vue'
import { vuetify } from '../plugins/vuetify';
import { snackbarManagerPlugin } from '@/core/snackbar-manager/snackbarManagerPlugin';
import { pinia } from '@/core/global-store/pinia';

createApp(DevToolsPanel)
	.use(vuetify)
	.use(snackbarManagerPlugin)
	.use(pinia)
	.mount('#app')
