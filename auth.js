import fs from "fs/promises";
import { homedir } from "os";
import path from "path";

const readOptionalFile = async (file) => {
  try {
    const res = await fs.readFile(file);
    console.error(`Using API key from ${file}`);
    return res.toString();
  } catch (e) {
    return null;
  }
};

const userHome = homedir();

const apiKey =
  process.env.IMANDRA_API_KEY ||
  (await readOptionalFile(
    path.join(userHome, ".config", "imandra", "api_key")
  )) ||
  (await readOptionalFile(
    path.join(userHome, ".config", "imandrax", "api_key")
  ));

if (!apiKey) {
  throw new Error(
    "Imandra Universe API key not found. Please set the IMANDRA_API_KEY environment variable or create a ~/.config/imandra/api_key file with your API key."
  );
}

export const headers = { Authorization: `Bearer ${apiKey}` };
