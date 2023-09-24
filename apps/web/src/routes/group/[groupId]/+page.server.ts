import { error, type Load } from '@sveltejs/kit';
import groupRepository from '$lib/repositories/group';

export const load: Load = async ({ params }) => {
	if (!params.groupId) {
		throw error(400, 'Group ID is required');
	}

	const group = await groupRepository.get(params.groupId);

	if (!group) {
		throw error(404, 'Group not found');
	}

	return {
		group
	};
};
