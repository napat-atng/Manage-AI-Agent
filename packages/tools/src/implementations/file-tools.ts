
import fs from "fs/promises";
import path from "path";
import { PathValidator } from "../security/path-validator";
import { z } from "zod";

export const ReadFileArgs = z.object({ path: z.string() });
export const WriteFileArgs = z.object({ path: z.string(), content: z.string() });

export class FileTools {
  constructor(private validator: PathValidator) {}

  async readFile(args: z.infer<typeof ReadFileArgs>) {
    const safePath = this.validator.validate(args.path);
    const content = await fs.readFile(safePath, "utf-8");
    return { content };
  }

  async writeFile(args: z.infer<typeof WriteFileArgs>) {
    const safePath = this.validator.validate(args.path);
    await fs.writeFile(safePath, args.content, "utf-8");
    return { success: true };
  }

  async listFiles(args: { directory: string }) {
    const safePath = this.validator.validate(args.directory);
    const files = await fs.readdir(safePath);
    return { files };
  }
}

