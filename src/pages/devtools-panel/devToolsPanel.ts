import '../../../node_modules/typescript/lib/typescriptServices.js' // TODO same thing imported in DevToolsPanel.vue
import { createApp } from 'vue'
import '../style.css'
import DevToolsPanel from './DevToolsPanel.vue'
import { vuetifyPlugin } from '@/core/vuetify/vuetifyPlugin';
import { snackbarManagerPlugin } from '@/core/snackbar-manager/snackbarManagerPlugin';
import { pinia } from '@/core/global-store/pinia';

createApp(DevToolsPanel)
	.use(vuetifyPlugin)
	.use(snackbarManagerPlugin)
	.use(pinia)
	.mount('#app')
