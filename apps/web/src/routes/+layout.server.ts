import type { Load } from '@sveltejs/kit';
import groupRepository from '$lib/server/repositories/group';
import { listConversationsWithGroups } from '$lib/server/repositories/conversation';

export const load: Load = async () => {
  const groups = await groupRepository.list();
  const groupsX = await listConversationsWithGroups('1-abc');
  console.log('groupsX', { groupsX });
  return {
    groups,
  };
};
