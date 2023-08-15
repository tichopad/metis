import { OPENAI_API_KEY, OPENAI_ORG } from '$env/static/private';
import logger from '$lib/logger';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';

export async function getChatCompletion(messages: ChatCompletionRequestMessage[]) {
	logger.trace('Started getChatCompletion');
	logger.debug(messages, 'getChatCompletion input messages');

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
