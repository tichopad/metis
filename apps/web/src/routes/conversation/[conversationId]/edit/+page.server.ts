import type { Group } from '$lib/server/database/schema';
import logger from '$lib/server/logger';
import { getConversationDetails, updateConversation } from '$lib/server/repositories/conversation';
import { getGroupDetails, listGroups } from '$lib/server/repositories/group';
import { error, type Actions, type Load, redirect } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
  if (!params.conversationId) throw error(404, `Conversation ID is undefined`);

  const conversation = await getConversationDetails(params.conversationId);

  if (!conversation) throw error(404, `Conversation ${params.conversationId} not found`);

  let group: Group | undefined;
  if (conversation.group_id !== null) {
    group = await getGroupDetails(conversation.group_id);
  }

  // TODO: handle concurrently
  const allGroups = await listGroups('1-abc');
  allGroups.unshift({
    created_at: '1992-02-11T15:00:00.000',
    id: '-',
    name: 'Draft',
    system_prompt: null,
    updated_at: '1992-02-11T15:00:00.000',
    user_id: '1-abc',
  });

  return { conversation, group, allGroups };
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
    const group = (formData.get('group') as string) || null;

    logger.info({ name, description, systemPrompt, group });

    if (!name) throw error(400, `Name is required`);

    // TODO: check that the group belongs to the user before updating

    const updatedConversation = await updateConversation({
      id: params.conversationId,
      name,
      description,
      system_prompt: systemPrompt,
      group_id: group === '-' ? null : group,
    });

    throw redirect(303, `/conversation/${updatedConversation.id}`);
  },
};
