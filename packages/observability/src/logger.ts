import pino from " pino\;

export const logger = pino({
 name: \@aacc/observability\,
 level: process.env.LOG_LEVEL || \info\,
 redact: [\password\, \token\, \authorization\],
 base: {
 env: process.env.NODE_ENV || \development\,
 }
});

export const logWithContext = (ctx: any, msg: string, data?: any) => {
 logger.info({ ...ctx, ...data }, msg);
};
