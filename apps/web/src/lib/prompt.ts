import { OPENAI_API_KEY, OPENAI_ORG } from '$env/static/private';
import logger from '$lib/logger.server';
import {
	Configuration,
	OpenAIApi,
	type ChatCompletionRequestMessage,
	type ChatCompletionResponseMessage
} from 'openai';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getChatCompletion(
	messages: ChatCompletionRequestMessage[]
): Promise<ChatCompletionResponseMessage | undefined> {
	logger.trace('Started getChatCompletion');
	logger.debug(messages, 'getChatCompletion input messages');

	// await delay(2000);

	// return { role: 'assistant', content: 'Lorem ipsum dolor sit amet consectetuer alipiscit elit.' };

	const configuration = new Configuration({
		organization: OPENAI_ORG,
		apiKey: OPENAI_API_KEY
	});
	const openai = new OpenAIApi(configuration);

	logger.trace('Created OpenAI API instance. Sending request for chat completion.');

	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages
	});

	logger.trace('Got chat completion response');
	logger.debug(response.data, 'Chat completion response data');

	return response.data.choices[0].message;
}
