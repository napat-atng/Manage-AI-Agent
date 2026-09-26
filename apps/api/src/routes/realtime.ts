import { Router } from " express\;
import { EventStreamHandler } from \../realtime/event-stream\;

const router = Router();
// Note: publisher should be injected via DI or singleton
const streamHandler = new EventStreamHandler({} as any);

router.get(\/tasks/:taskId/events\, (req, res) => streamHandler.handleSSE(req, res));

export default router;
