import '../../node_modules/typescript/lib/typescriptServices.js'
import { createApp } from 'vue'
import '../style.css'
import DevToolsPanel from '../root/DevToolsPanel.vue'
import { vuetify } from '../plugins/vuetify';
import { snackbarManager } from '../plugins/snackbarManager';

createApp(DevToolsPanel)
	.use(vuetify)
	.use(snackbarManager)
	.mount('#app')
