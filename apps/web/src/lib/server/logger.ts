import { LOG_LEVEL } from '$env/static/private';
import pino from 'pino';
import pinoPretty from 'pino-pretty';

const stream = pinoPretty({ colorize: true });
const logger = pino({ level: LOG_LEVEL }, stream);

logger.trace('Logger initialized.');

export default logger;
