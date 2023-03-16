import '../../node_modules/typescript/lib/typescriptServices.js'
import { createApp } from 'vue'
import '../style.css'
import { vuetify } from '../plugins/vuetify';
import ManageScripts from '../root/ManageScripts.vue';

createApp(ManageScripts)
	.use(vuetify)
	.mount('#app')
