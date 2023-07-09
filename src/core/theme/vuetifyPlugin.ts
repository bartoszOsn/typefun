import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { getBrowserMode } from '@/utils/getBrowserMode';

export const vuetifyPlugin = createVuetify({
	components,
	directives,
	theme: {
		defaultTheme: getBrowserMode()
	},
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		}
	}
});
