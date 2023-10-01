import type { Actions } from './$types';
import { getChatCompletion } from '$lib/server/prompt';
import { error, type Load } from '@sveltejs/kit';
import groupRepository from '$lib/server/repositories/group';
import type { ChatCompletionMessage } from 'openai/resources/chat';

export const load: Load = async ({ params }) => {
  if (!params.conversationId) throw error(404, `Conversation ID is undefined`);
  if (!params.groupId) throw error(404, `Group ID is undefined`);

  // TODO: group can be joined to conversation instead of fetching both separately
  const [conversation, group, messages] = await Promise.all([
    groupRepository.getConversation(params.conversationId),
    groupRepository.get(params.groupId),
    groupRepository.listMessages(params.conversationId),
  ]);

  return { conversation, group, messages };
};

export const actions: Actions = {
  prompt: async ({ request, params }) => {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;

    const messages = await groupRepository.listMessages(params.conversationId);
    const conversation = await groupRepository.getConversation(params.conversationId);

    if (prompt === undefined) {
      return messages;
    }

    let systemPrompt = conversation.system_prompt;

    if (systemPrompt === null) {
      const group = await groupRepository.get(params.groupId);
      systemPrompt = group.system_prompt;
    }

    const userInsertedMessage = await groupRepository.putMessage({
      author: 'user',
      content: prompt,
      conversation_id: params.conversationId,
    });
    messages.push(userInsertedMessage);

    const apiCompatibleMessages: ChatCompletionMessage[] = messages.map((message) => ({
      role: message.author === 'user' ? 'user' : 'assistant',
      content: message.content,
    }));
    apiCompatibleMessages.unshift({ role: 'system', content: systemPrompt });

    const response = await getChatCompletion(apiCompatibleMessages);
    if (response === undefined || response.content === null) {
      throw error(500, `OpenAI API returned empty response`);
    }

    const botInsertedMessage = await groupRepository.putMessage({
      author: 'bot',
      content: response.content,
      conversation_id: params.conversationId,
    });
    messages.push(botInsertedMessage);

    return messages;
  },
};
