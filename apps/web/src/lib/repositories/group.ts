import logger from '$lib/logger.server';
import { error } from '@sveltejs/kit';
import type { ChatCompletionResponseMessage } from 'openai';

type ID = string;

type Message = ChatCompletionResponseMessage;
type Conversation = {
	id: ID;
	groupId: ID;
	name: string;
	messages: Message[];
};
type Group = {
	id: ID;
	name: string;
	systemPrompt: string;
	conversations: Conversation[];
};

type PartialGroupWithoutId = Partial<Omit<Group, 'id'>>;
type Database = Map<ID, Group>;

export class GroupRepository {
	constructor(private readonly database: Database) {}

	async get(id: ID): Promise<Group> {
		logger.debug(`Getting group ${id}`);
		const group = this.database.get(id);
		if (group === undefined) {
			throw error(404, `Group ${id} not found`);
		}
		return group;
	}

	async list(): Promise<Group[]> {
		logger.debug(`Listing groups`);
		return Array.from(this.database.values());
	}

	async update(id: ID, group: PartialGroupWithoutId): Promise<Group> {
		logger.debug(`Updating group ${id}`);
		const existingGroup = await this.get(id);

		const updatedGroup = { ...existingGroup, ...group };
		this.database.set(id, updatedGroup);

		return updatedGroup;
	}

	async put(group: Group): Promise<Group> {
		logger.debug(`Putting group ${group.id}`);
		this.database.set(group.id, group);
		return group;
	}

	async getConversation(groupId: ID, conversationId: ID): Promise<Conversation> {
		logger.debug(`Getting conversation ${conversationId} in group ${groupId}`);
		const group = await this.get(groupId);
		const conversation = group.conversations.find((c) => c.id === conversationId);
		if (conversation === undefined) {
			throw error(404, `Conversation ${conversationId} not found in group ${groupId}`);
		}
		return conversation;
	}

	async updateConversation(
		groupId: ID,
		conversationId: ID,
		conversation: Partial<Omit<Conversation, 'id'>>
	): Promise<Conversation> {
		logger.debug(`Updating conversation ${conversationId} in group ${groupId}`);

		const existingConversation = await this.getConversation(groupId, conversationId);

		if (!existingConversation) throw error(404, `Conversation ${conversationId} not found`);

		const updatedConversation = { ...existingConversation, ...conversation };

		const group = await this.get(groupId);

		group.conversations = group.conversations.map((c) => {
			if (c.id === conversationId) return updatedConversation;
			return c;
		});

		await this.update(groupId, group);

		return updatedConversation;
	}

	async putConversation(groupId: ID, conversation: Conversation): Promise<Conversation> {
		logger.debug(`Putting conversation ${conversation.id} in group ${groupId}`);
		const group = await this.get(groupId);

		group.conversations.push(conversation);
		this.database.set(groupId, group);

		return conversation;
	}
}

const db = new Map();
const groupRepository = new GroupRepository(db);

export default groupRepository;
