import type { Group } from '$lib/server/database/schema';
import { getConversationDetails, updateConversation } from '$lib/server/repositories/conversation';
import { getGroupDetails } from '$lib/server/repositories/group';
import { error, type Actions, type Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
  if (!params.conversationId) throw error(404, `Conversation ID is undefined`);

  const conversation = await getConversationDetails(params.conversationId);

  if (!conversation) throw error(404, `Conversation ${params.conversationId} not found`);

  let group: Group | undefined;
  if (conversation.group_id !== null) {
    group = await getGroupDetails(conversation.group_id);
  }

  return { conversation, group };
};

export const actions: Actions = {
  default: async ({ params, request }) => {
    // TODO: inject conversationId in a hidden text input to avoid roundtrip to DB if possible
    if (!params.conversationId) throw error(404, `Conversation ID is undefined`);

    const conversation = await getConversationDetails(params.conversationId);

    if (!conversation) {
      throw error(404, `Conversation ${params.conversationId} not found`);
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const systemPrompt = (formData.get('system_prompt') as string) || null;

    if (!name) throw error(400, `Name is required`);

    const updatedConversation = await updateConversation({
      id: params.conversationId,
      name,
      description,
      system_prompt: systemPrompt,
    });

    return { updatedConversation };
  },
};
