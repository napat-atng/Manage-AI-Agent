import { describe, it, expect } from " vitest\;
import { Sandbox } from \../src/security/sandbox\;

describe(\API Security Sandbox\, () => {
 const sandbox = new Sandbox();

 it(\should allow access within workspace\, () => {
 const path = sandbox.validatePath(\D:\\Manage AI Agent\\file.txt\);
 expect(path).toContain(\D:\\Manage AI Agent\);
 });

 it(\should block access outside workspace\, () => {
 expect(() => sandbox.validatePath(\C:\\Windows\\system32\)).toThrow(\Security Error\);
 });

 it(\should block banned commands\, () => {
 expect(() => sandbox.validateCommand(\rm -rf /\,)).toThrow(\Security Error\);
 });
});
