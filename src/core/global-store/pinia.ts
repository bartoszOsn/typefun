import { createPinia } from 'pinia';
import { storePlugin } from './storePlugin';
import { migrate } from './ScriptsStoreState';

export const pinia = createPinia()
	.use(storePlugin(migrate));
