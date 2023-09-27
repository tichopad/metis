import type { Load } from '@sveltejs/kit';
import groupRepository from '$lib/server/repositories/group';

export const load: Load = async () => {
  const groups = await groupRepository.list();

  return {
    groups,
  };
};
