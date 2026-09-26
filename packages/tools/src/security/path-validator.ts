
import path from "path";

export class PathValidator {
  constructor(private workspaceRoot: string) {}

  validate(targetPath: string): string {
    const resolvedPath = path.resolve(this.workspaceRoot, targetPath);
    
    if (!resolvedPath.startsWith(this.workspaceRoot)) {
      throw new Error("Security Error: Attempted to access path outside of workspace root.");
    }

    return resolvedPath;
  }
}

