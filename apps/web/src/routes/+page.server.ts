import type { Actions } from './$types';
import { getChatCompletion } from '$lib/prompt';
import type { ChatCompletionRequestMessage } from 'openai';
import type { Load } from '@sveltejs/kit';

const messages: ChatCompletionRequestMessage[] = [];

export const load: Load = async () => {
	return { messages };
};

export const actions: Actions = {
	prompt: async (event) => {
		const formData = await event.request.formData();
		const prompt = formData.get('prompt') as string;

		if (prompt === undefined) {
			return messages;
		}

		messages.push({ role: 'user', content: prompt });

		const response = await getChatCompletion(messages);

		if (response !== undefined) {
			messages.push(response);
		}

		return messages;
	}
};
