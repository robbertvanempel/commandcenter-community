import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

export function defaultDataDirectory() {
  if (process.platform === "darwin")
    return path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "Command Center",
    );
  if (process.platform === "win32")
    return path.join(
      process.env.LOCALAPPDATA || process.env.APPDATA || os.homedir(),
      "Command Center",
    );
  return path.join(
    process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"),
    "command-center",
  );
}

export function resolveDataDirectory(cwd = process.cwd()) {
  const configured = process.env.COMMAND_CENTER_DATA_DIR?.trim();
  if (configured) {
    if (!path.isAbsolute(configured))
      throw new Error("COMMAND_CENTER_DATA_DIR must be an absolute path.");
    return configured;
  }
  const legacy = path.join(cwd, ".command-center");
  return existsSync(legacy) ? legacy : defaultDataDirectory();
}

export function npmCommand() {
  if (process.env.npm_execpath)
    return { command: process.execPath, prefix: [process.env.npm_execpath] };
  return {
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    prefix: [],
  };
}

export function loadLocalEnvironment(cwd = process.cwd()) {
  const environmentPath = path.join(cwd, ".env.local");
  if (existsSync(environmentPath)) process.loadEnvFile(environmentPath);
}
