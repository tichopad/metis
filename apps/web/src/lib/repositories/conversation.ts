import logger from '$lib/logger.server';
import type { ChatCompletionRequestMessage } from 'openai';

type ID = string;
type Conversation = {
	id: ID;
	name: string;
	messages: ChatCompletionRequestMessage[];
};
type Database = Map<ID, Conversation>;

type PartialConversationWithoutId = Partial<Omit<Conversation, 'id'>>;

export default class ConversationRepository {
	constructor(private readonly database: Database) {}

	async get(id: ID): Promise<Conversation | undefined> {
		logger.info(`Getting conversation ${id}`);
		return this.database.get(id);
	}

	async update(id: ID, conversation: PartialConversationWithoutId): Promise<Conversation> {
		logger.info(`Updating conversation ${id}`);

		const existingConversation = await this.get(id);
		if (existingConversation === undefined) {
			throw new Error(`Conversation ${id} not found`);
		}

		const updatedConversation = { ...existingConversation, ...conversation };
		this.database.set(id, updatedConversation);

		return updatedConversation;
	}

	async put(conversation: Conversation): Promise<Conversation> {
		logger.info(`Putting conversation ${conversation.id}`);
		this.database.set(conversation.id, conversation);
		return conversation;
	}

	async putMessage(id: ID, message: ChatCompletionRequestMessage): Promise<Conversation> {
		logger.info(`Putting message in conversation ${id}`);

		const conversation = await this.get(id);
		if (conversation === undefined) {
			throw new Error(`Conversation ${id} not found`);
		}

		conversation.messages.push(message);
		this.update(id, conversation);

		return conversation;
	}
}
