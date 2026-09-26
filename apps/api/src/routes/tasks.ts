import { Router } from " express\;
import { validate } from \../middleware/validation\;
import { z } from \zod\;

const router = Router();

const CreateTaskSchema = z.object({
 body: z.object({
 workflowId: z.string().uuid(),
 userId: z.string().uuid().optional(),
 inputData: z.record(z.any()).nullable(),
 })
});

const GetTaskSchema = z.object({
 params: z.object({
 id: z.string().uuid(),
 })
});

router.post(\/\, validate(CreateTaskSchema), (req, res) => {
 res.status(202).json({ message: \Task accepted\, taskId: \sample-uuid\ });
});

router.get(\/\, (req, res) => {
 res.status(200).json([{ taskId: \sample-uuid\, status: \pending\ }]);
});

router.get(\/:id\, validate(GetTaskSchema), (req, res) => {
 res.status(200).json({ taskId: req.params.id, status: \pending\ });
});

router.post(\/:id/approve\, validate(GetTaskSchema), (req, res) => {
 res.status(200).json({ message: \Task approved\, taskId: req.params.id });
});

export default router;
