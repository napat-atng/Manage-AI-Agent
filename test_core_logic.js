const { z } = require("zod");
const path = require("path");

// ????? PathValidator ?????????????????? import ??????????????????? ???????????????
class PathValidator {
    constructor(root) { this.root = path.resolve(root); }
    validatePath(p) {
        const resolved = path.resolve(p);
        return resolved.startsWith(this.root);
    }
}

// ????? Zod Schema ???????
const CreateTaskSchema = z.object({
    title: z.string().min(1),
    workflowId: z.string().uuid(),
    priority: z.enum(["low", "medium", "high"])
});

const root = "D:/Manage AI Agent";
const validator = new PathValidator(root);

console.log("--- [TEST 1] Security Sandbox ---");
const cases = [
    { p: "D:/Manage AI Agent/docs/readme.md", exp: true, d: "Internal" },
    { p: "D:/Windows/System32/cmd.exe", exp: false, d: "External" },
    { p: "D:/Manage AI Agent/../Windows/System32/cmd.exe", exp: false, d: "Traversal" }
];
cases.forEach(c => {
    const res = validator.validatePath(c.p);
    console.log(`[${res === c.exp ? "PASS" : "FAIL"}] ${c.d}: ${res}`);
});

console.log("\n--- [TEST 2] Zod Validation ---");
const validData = { title: "Test Task", workflowId: "550e8400-e29b-41d4-a716-446655440000", priority: "high" };
const invalidData = { title: "", workflowId: "invalid-uuid", priority: "ultra" };

try {
    CreateTaskSchema.parse(validData);
    console.log("[PASS] Valid data accepted");
} catch (e) { console.log("[FAIL] Valid data rejected"); }

try {
    CreateTaskSchema.parse(invalidData);
    console.log("[FAIL] Invalid data accepted");
} catch (e) { console.log("[PASS] Invalid data rejected as expected"); }
