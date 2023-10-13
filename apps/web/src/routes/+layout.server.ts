import type { Load } from '@sveltejs/kit';
import { listConversationsWithGroups } from '$lib/server/repositories/conversation';

export const load: Load = async () => {
  const conversationsList = await listConversationsWithGroups('1-abc');
  return {
    conversationsList,
  };
};
