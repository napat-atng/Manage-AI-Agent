import { Request, Response, NextFunction } from " express\;

const requests = new Map<string, { count: number; reset: number }>();

export const rateLimit = (limit: number, windowMs: number) => {
 return (req: Request, res: Response, next: NextFunction) => {
 const ip = req.ip || req.socket.remoteAddress || \unknown\;
 const now = Date.now();
 const userReq = requests.get(ip) || { count: 0, reset: now + windowMs };

 if (now > userReq.reset) {
 userReq.count = 0;
 userReq.reset = now + windowMs;
 }

 userReq.count++;
 requests.set(ip, userReq);

 if (userReq.count > limit) {
 return res.status(429).json({ error: \Too Many Requests\, retryAfter: userReq.reset - now });
 }
 next();
 };
};
