import { Router } from " express\;
import { Request, Response } from \express\;

const router = Router();

router.post(\/login\, (req, res) => {
 // Mock login
 res.status(200).json({ token: \sess-uuid\, user: { userId: \user-uuid\, role: \member\ } });
});

router.post(\/logout\, (req, res) => {
 res.status(200).json({ message: \Logged out\ });
});

router.get(\/me\, (req, res) => {
 res.status(200).json({ userId: \user-uuid\, role: \member\ });
});

export default router;
