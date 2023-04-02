import { createPinia } from 'pinia';
import { storePlugin } from './storePlugin';

export const pinia = createPinia()
	.use(storePlugin);
