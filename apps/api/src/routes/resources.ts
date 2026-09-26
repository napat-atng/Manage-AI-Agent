import { Router } from " express\;
import { validate } from \../middleware/validation\;
import { z } from \zod\;

const router = Router();

const ResourceSchema = z.object({
 params: z.object({
 id: z.string().uuid(),
 })
});

const CreateResourceSchema = z.object({
 body: z.object({
 name: z.string().min(1),
 description: z.string().nullable(),
 config: z.record(z.any()).optional(),
 })
});

// Agents
router.get(\/agents\, (req, res) => res.json([]));
router.post(\/agents\, validate(CreateResourceSchema), (req, res) => res.status(201).json({ agentId: \uuid\ }));
router.get(\/agents/:id\, validate(ResourceSchema), (req, res) => res.json({ agentId: \uuid\ }));

// Workflows
router.get(\/workflows\, (req, res) => res.json([]));
router.post(\/workflows\, validate(CreateResourceSchema), (req, res) => res.status(201).json({ workflowId: \uuid\ }));
router.get(\/workflows/:id\, validate(ResourceSchema), (req, res) => res.json({ workflowId: \uuid\ }));

// Tools
router.get(\/tools\, (req, res) => res.json([]));
router.post(\/tools\, validate(CreateResourceSchema), (req, res) => res.status(201).json({ toolId: \uuid\ }));
router.get(\/tools/:id\, validate(ResourceSchema), (req, res) => res.json({ toolId: \uuid\ }));

export default router;
