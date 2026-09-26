import path from " path\;

export class Sandbox {
 private readonly allowedWorkspace = \D:\\Manage AI Agent\;

 validatePath(targetPath: string): string {
 const resolved = path.resolve(targetPath);
 if (!resolved.startsWith(this.allowedWorkspace)) {
 throw new Error(\Security Error: Access denied to path outside workspace\);
 }
 return resolved;
 }

 validateCommand(cmd: string): boolean {
 const bannedKeywords = [\rm -rf\, \format\, \shutdown\, \mkfs\, \del /s /q\];
 if (bannedKeywords.some(k => cmd.toLowerCase().includes(k))) {
 throw new Error(\Security Error: Banned command detected\);
 }
 return true;
 }
}
