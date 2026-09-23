# AI Agent Control Center V1 Playbook

ชุดเอกสารสั่งงานสำหรับสร้าง AI Agent Control Center V1 แบบ local-first. เริ่มจาก `CHECKLIST.md` แล้วส่ง **หนึ่ง Phase ต่อหนึ่ง task** ให้ Codex, Antigravity หรือ Claude เพื่อให้ review, test และ handoff ชัดเจน.

## วิธีใช้

1. อ่าน `00-project-rules.md` และอนุมัติ architecture baseline ก่อนเริ่ม.
2. ทำตามลำดับใน `CHECKLIST.md`; ห้ามข้าม dependency ที่ยังไม่ผ่าน acceptance criteria.
3. เปิดไฟล์ Phase ที่จะทำ แล้วส่งส่วน `Handoff prompt template` ทั้งหมดให้ coding agent พร้อม repository root.
4. Agent ต้องแก้เฉพาะ scope, รัน verification, รายงานไฟล์ที่เปลี่ยนและผลทดสอบ, แล้วติ๊ก checklist หลังมนุษย์ review.
5. หากงานต้องเลือกค่าตามเครื่อง ให้บันทึกค่าที่เลือกใน `.env.local` (ห้าม commit secret) และ update `docs/decisions.md` ใน repo เป้าหมาย.

## ใช้กับ Codex / Antigravity / Claude

- **Codex:** เปิด repository, แนบ Phase file และสั่งให้ทำตาม handoff prompt; ให้ Codex อ่านไฟล์ก่อนแก้ไข.
- **Antigravity:** สร้าง task ใหม่ต่อ Phase, วาง handoff prompt, ตรวจ diff และผลคำสั่งก่อน merge.
- **Claude:** ใช้ Project knowledge ใส่ `00-project-rules.md` และ `CHECKLIST.md`; วาง Phase file เป็น task context.

## กฎการทำงานร่วมกัน

- ทำ Phase เดียวต่อ branch/task; ไม่แก้ Phase ที่ dependency ยังไม่ complete.
- `packages/contracts` เป็น source of truth ของ request/response/event schema; เปลี่ยนแบบ breaking ต้องเพิ่ม version/migration.
- ใช้ TypeScript strict, Zod ที่ boundary, Pino structured logs และไม่ commit `.env*` ที่มี secret.
- Local-first: Ollama + LiteLLM เป็น default; cloud provider เป็น opt-in ผ่าน environment variable เท่านั้น.
- ทุก mutation ที่ต้องแจ้ง UI ต้องเขียน outbox transactionally; event เป็น append-only และ replay ได้.

## เอกสาร

เริ่มที่ [CHECKLIST.md](CHECKLIST.md). ไฟล์ `00` ถึง `20` เป็นแผนส่งมอบเรียงลำดับและมี format เดียวกัน.
