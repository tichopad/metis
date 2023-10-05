import { OPENAI_API_KEY } from '$env/static/private';
import logger from '$lib/server/logger';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fakeResponse = async () => {
  await delay(2000);
  return {
    role: 'assistant' as const,
    content: 'Lorem ipsum dolor sit amet consectetuer alipiscit elit.',
  };
};

export async function getChatCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessage[],
): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | undefined> {
  logger.trace('Started getChatCompletion');
  logger.debug(messages, 'getChatCompletion input messages');

  // return fakeResponse();

  logger.trace('Created OpenAI API instance. Sending request for chat completion.');

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
  });

  logger.trace('Got chat completion response');
  logger.debug(response, 'Chat completion response data');

  return response.choices[0].message;
}
