import express from " express\;
import pino from \pino\;
import tasksRouter from \./routes/tasks\;
import resourcesRouter from \./routes/resources\;
import realtimeRouter from \./routes/realtime\;
import authRouter from \./auth/auth.routes\;
import { requireUser } from \./auth/auth.middleware\;
import { errorHandler } from \./middleware/error\;
import { rateLimit } from \./security/rate-limit\;

const app = express();
const logger = pino({ name: \@aacc/api\ });
const port = Number(process.env.API_PORT ?? 3001);

app.use(express.json());

// Global Rate Limit for API
app.use(rateLimit(100, 60 * 1000));

app.get(\/health\, (_request, response) => response.status(200).json({ status: \ok\ }));

// Auth Routes
app.use(\/api/v1/auth\, authRouter);

// Protected API v1 Routes
app.use(\/api/v1\, requireUser);
app.use(\/api/v1/tasks\, tasksRouter);
app.use(\/api/v1\, resourcesRouter);
app.use(\/api/v1\, realtimeRouter);

// Error Handling
app.use(errorHandler);

app.listen(port, () => logger.info({ port }, \API v1 listening with Security Sandbox\));
