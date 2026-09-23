import pino from 'pino';

const logger = pino({ name: '@aacc/worker' });
logger.info('Worker skeleton started');
