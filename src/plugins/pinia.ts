import { createPinia } from 'pinia';
import { storePlugin } from '../store/storePlugin';

export const pinia = createPinia()
	.use(storePlugin);