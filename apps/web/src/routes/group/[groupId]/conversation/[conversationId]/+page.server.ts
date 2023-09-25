import type { Actions } from './$types';
import { getChatCompletion } from '$lib/prompt';
import { error, type Load } from '@sveltejs/kit';
import groupRepository from '$lib/repositories/group';

const db = new Map();

export const load: Load = async ({ params }) => {
	if (!params.conversationId) throw error(404, `Conversation ID is undefined`);
	if (!params.groupId) throw error(404, `Group ID is undefined`);

	const conversation = await groupRepository.getConversation(params.groupId, params.conversationId);
	const group = await groupRepository.get(params.groupId);

	return { conversation, group };
};

export const actions: Actions = {
	prompt: async ({ request, params }) => {
		const formData = await request.formData();
		const prompt = formData.get('prompt') as string;

		const conversation = await groupRepository.getConversation(
			params.groupId,
			params.conversationId
		);

		if (prompt === undefined) {
			return conversation.messages;
		}

		const group = await groupRepository.get(params.groupId);

		conversation.messages.push({ role: 'user', content: prompt });

		const response = await getChatCompletion([
			{ role: 'system', content: group.systemPrompt },
			...conversation.messages
		]);

		if (response !== undefined) {
			conversation.messages.push(response);
		}

		await groupRepository.updateConversation(params.groupId, params.conversationId, conversation);

		return conversation.messages;
	}
};
