import type { Load } from '@sveltejs/kit';
import groupRepository from '$lib/server/repositories/group';

export const load: Load = async () => {
  return {
    groups: await groupRepository.list(),
  };
};
