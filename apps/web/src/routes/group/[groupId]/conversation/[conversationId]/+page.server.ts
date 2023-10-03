import { createId } from '$lib/helpers/id';
import { getChatCompletion } from '$lib/server/prompt';
import { getConversationDetails } from '$lib/server/repositories/conversation';
import { getGroupDetails } from '$lib/server/repositories/group';
import { createMessage, listMessages } from '$lib/server/repositories/message';
import { error, type Load } from '@sveltejs/kit';
import type { ChatCompletionMessage } from 'openai/resources/chat';
import type { Actions } from './$types';

export const load: Load = async ({ params }) => {
  if (!params.conversationId) throw error(404, `Conversation ID is undefined`);
  if (!params.groupId) throw error(404, `Group ID is undefined`);

  // TODO: group can be joined to conversation instead of fetching both separately
  const [conversation, group, messages] = await Promise.all([
    getConversationDetails(params.conversationId),
    getGroupDetails(params.groupId),
    listMessages(params.conversationId),
  ]);

  if (!conversation) throw error(404, `Conversation ${params.conversationId} not found`);

  return { conversation, group, messages };
};

export const actions: Actions = {
  prompt: async ({ request, params }) => {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;

    const messages = await listMessages(params.conversationId);

    if (prompt === undefined) {
      return messages;
    }

    const conversation = await getConversationDetails(params.conversationId);

    if (!conversation) {
      throw error(404, `Conversation ${params.conversationId} not found`);
    }

    let systemPrompt = conversation.system_prompt;

    if (systemPrompt === null) {
      const group = await getGroupDetails(params.groupId);
      if (group) {
        systemPrompt = group.system_prompt;
      }
    }

    const userInsertedMessage = await createMessage({
      id: createId(),
      author: 'user',
      content: prompt,
      conversation_id: params.conversationId,
    });
    messages.push(userInsertedMessage);

    const apiCompatibleMessages: ChatCompletionMessage[] = messages.map((message) => ({
      role: message.author,
      content: message.content,
    }));
    apiCompatibleMessages.unshift({ role: 'system', content: systemPrompt });

    const response = await getChatCompletion(apiCompatibleMessages);

    if (response === undefined || response.content === null) {
      throw error(500, `OpenAI API returned empty response`);
    }

    const botInsertedMessage = await createMessage({
      id: createId(),
      author: 'assistant',
      content: response.content,
      conversation_id: params.conversationId,
    });
    messages.push(botInsertedMessage);

    return messages;
  },
};
