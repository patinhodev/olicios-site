import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const ignored = new Set([".git", "node_modules", "target", "assets"]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".java",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".properties",
  ".xml",
  ".yaml",
  ".yml",
]);
const secretPatterns = [
  ["chave privada", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["token do GitHub", /gh[pousr]_[A-Za-z0-9]{30,}/],
  ["chave da API OpenAI", /sk-[A-Za-z0-9_-]{20,}/],
  ["chave da AWS", /AKIA[0-9A-Z]{16}/],
];
const findings = [];

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await scan(filePath);
      continue;
    }
    if (!textExtensions.has(path.extname(entry.name))) continue;

    const content = await readFile(filePath, "utf8");
    for (const [label, pattern] of secretPatterns) {
      if (pattern.test(content)) {
        findings.push(`${label}: ${path.relative(root, filePath)}`);
      }
    }
  }
}

await scan(root);

if (findings.length) {
  console.error(`Possíveis segredos encontrados:\n${findings.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("Verificação básica de segredos concluída sem ocorrências.");
}
