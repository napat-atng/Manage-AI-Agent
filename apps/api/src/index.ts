import express from " express\;
import pino from \pino\;
import tasksRouter from \./routes/tasks\;
import resourcesRouter from \./routes/resources\;
import realtimeRouter from \./routes/realtime\;
import { errorHandler } from \./middleware/error\;

const app = express();
const logger = pino({ name: \@aacc/api\ });
const port = Number(process.env.API_PORT ?? 3001);

app.use(express.json());

app.get(\/health\, (_request, response) => response.status(200).json({ status: \ok\ }));

// API v1 Routes
app.use(\/api/v1/tasks\, tasksRouter);
app.use(\/api/v1\, resourcesRouter);
app.use(\/api/v1\, realtimeRouter);

// Error Handling
app.use(errorHandler);

app.listen(port, () => logger.info({ port }, \API v1 listening\));
