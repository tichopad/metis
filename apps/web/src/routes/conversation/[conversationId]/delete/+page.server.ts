import { deleteConversation, getConversationDetails } from '$lib/server/repositories/conversation';
import { error, type Actions, type Load, redirect } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
  const conversationId = params.conversationId;

  if (!conversationId) throw error(404, 'Conversation not found');

  const conversation = await getConversationDetails(conversationId);

  if (!conversation) throw error(404, 'Conversation not found');

  return { conversation };
};

export const actions: Actions = {
  default: async ({ params }) => {
    const conversationId = params.conversationId;

    if (!conversationId) throw error(404, 'Conversation not found');

    await deleteConversation(conversationId);

    throw redirect(303, '/');
  },
};
