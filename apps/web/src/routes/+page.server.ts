import type { Actions } from './$types';
import { VITE_OPENAI_API_KEY } from '$env/static/private';

export const actions: Actions = {
	default: async (event) => {
		console.log({ VITE_OPENAI_API_KEY });
		return [
			'Lorem ipsum dolor sit amet.',
			'Consectetur adipiscing elit.',
			'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
		];
	}
};
