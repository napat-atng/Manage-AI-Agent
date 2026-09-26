
import { exec } from "child_process";
import { promisify } from "util";
import { PathValidator } from "../security/path-validator";

const execPromise = promisify(exec);

export class GitTools {
  constructor(private validator: PathValidator) {}

  async getStatus() {
    const { stdout } = await execPromise("git status --short");
    return { status: stdout };
  }

  async getDiff() {
    const { stdout } = await execPromise("git diff");
    return { diff: stdout };
  }
}

