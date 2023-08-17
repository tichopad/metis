import type { ChatCompletionRequestMessage } from 'openai';

type ID = string;
type Conversation = {
	id: ID;
	name: string;
	messages: ChatCompletionRequestMessage[];
};

const db = new Map<ID, Conversation>();

/**
 * Get a conversation by ID.
 */
export async function getConversation(id: ID): Promise<Conversation | undefined> {
	return db.get(id);
}

type PartialConversationWithoutId = Partial<Omit<Conversation, 'id'>>;
/**
 * Update a conversation.
 *
 * @throws If the conversation does not exist.
 * @returns The updated conversation.
 */
export async function updateConversation(
	id: ID,
	conversation: PartialConversationWithoutId
): Promise<Conversation> {
	const existingConversation = await getConversation(id);

	if (existingConversation === undefined) {
		throw new Error(`Conversation ${id} not found`);
	}

	const updatedConversation = { ...existingConversation, ...conversation };

	db.set(id, updatedConversation);

	return updatedConversation;
}

/**
 * Inserts a new messages at the end of the conversation.
 */
export async function putMessage(id: ID, message: ChatCompletionRequestMessage): Promise<void> {
	const conversation = await getConversation(id);

	if (conversation === undefined) {
		throw new Error(`Conversation ${id} not found`);
	}

	conversation.messages.push(message);
}
