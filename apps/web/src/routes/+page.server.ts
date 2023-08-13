import type { Actions } from './$types';
import { VITE } from '$env/static/private';

export const actions: Actions = {
	default: async (event) => {
		console.log('apikey', import.meta.env);
		return ['Lorem ipsum dolor sit amet.', 'Consectetur adipiscing elit.'];
	}
};
