import type { Actions } from './$types';
import { getChatCompletion } from '$lib/prompt';
import type { Load } from '@sveltejs/kit';
import ConversationRepository from '$lib/repositories/conversation';

const db = new Map();

export const load: Load = async ({ params }) => {
	const conversations = new ConversationRepository(db);

	if (!params.conversationId) {
		throw new Error('Conversation ID is required');
	}

	const conversation = await conversations.get(params.conversationId);

	if (!conversation) {
		await conversations.put({
			id: params.conversationId,
			name: 'Conversation',
			messages: []
		});
	}

	return {
		messages: conversation?.messages ?? []
	};
};

export const actions: Actions = {
	prompt: async (event) => {
		const formData = await event.request.formData();
		const prompt = formData.get('prompt') as string;

		const conversations = new ConversationRepository(db);
		const conversation = await conversations.get(event.params.conversationId);
		const messages = conversation?.messages ?? [];

		if (prompt === undefined) {
			return messages;
		}

		messages.push({ role: 'user', content: prompt });

		const response = await getChatCompletion(messages);

		if (response !== undefined) {
			messages.push(response);
		}

		await conversations.update(event.params.conversationId, { messages });

		return messages;
	}
};
