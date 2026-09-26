import { PathValidator } from "./packages/tools/src/security/path-validator";
import path from "path";

const root = "D:/Manage AI Agent";
const validator = new PathValidator(root);

const testCases = [
  { path: "D:/Manage AI Agent/docs/readme.md", expected: true, desc: "Internal file" },
  { path: "D:/Windows/System32/cmd.exe", expected: false, desc: "External file" },
  { path: "D:/Manage AI Agent/../Windows/System32/cmd.exe", expected: false, desc: "Path Traversal" },
];

console.log("--- Testing Security Sandbox ---");
testCases.forEach(({path, expected, desc}) => {
  const result = validator.validatePath(path);
  console.log(`[${result === expected ? "PASS" : "FAIL"}] ${desc}: ${path} -> ${result}`);
});
