import express from 'express';
import pino from 'pino';

const app = express();
const logger = pino({ name: '@aacc/api' });
const port = Number(process.env.API_PORT ?? 3001);

app.get('/health', (_request, response) => response.status(200).json({ status: 'ok' }));

app.listen(port, () => logger.info({ port }, 'API skeleton listening'));
