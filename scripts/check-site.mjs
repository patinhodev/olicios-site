import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const frontend = path.join(root, "frontend");
const htmlPath = path.join(frontend, "index.html");
const html = await readFile(htmlPath, "utf8");
const errors = [];
const checkedReferences = new Set();
const frontendFiles = await readdir(frontend, { recursive: true });
const frontendEntries = new Set(
  frontendFiles.map((entry) => entry.split(path.sep).join("/")),
);

async function validateReference(reference, baseDirectory = frontend) {
  const cleanReference = reference.split(/[?#]/)[0];
  if (!cleanReference || /^(?:data:|https?:|mailto:|tel:)/i.test(cleanReference)) {
    return;
  }

  const absolutePath = path.resolve(baseDirectory, cleanReference);
  if (!absolutePath.startsWith(frontend + path.sep)) {
    errors.push(`Referência fora do frontend: ${reference}`);
    return;
  }

  const relativePath = path.relative(frontend, absolutePath);
  const portablePath = relativePath.split(path.sep).join("/");
  checkedReferences.add(portablePath);
  if (!frontendEntries.has(portablePath)) {
    errors.push(`Referência ausente ou com letras maiúsculas incorretas: ${reference}`);
    return;
  }
  try {
    await access(absolutePath);
  } catch {
    errors.push(`Referência local ausente: ${reference}`);
  }
}

const htmlReferences = [...html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)].map(
  (match) => match[1],
);

for (const reference of htmlReferences) {
  await validateReference(reference);
}

for (const relativeFile of frontendFiles) {
  if (path.extname(relativeFile) !== ".css") continue;
  const cssPath = path.join(frontend, relativeFile);
  const css = await readFile(cssPath, "utf8");
  for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    await validateReference(match[1], path.dirname(cssPath));
  }
}

const galleryScript = await readFile(path.join(frontend, "events-gallery.js"), "utf8");
const galleryBase = galleryScript.match(/const base = "([^"]+)"/)?.[1];
if (!galleryBase) {
  errors.push("Diretório-base das galerias não foi encontrado.");
} else {
  const galleryImages = [
    ...galleryScript.matchAll(/"([^"/]+\.(?:avif|gif|jpe?g|png|webp))"/gi),
  ].map((match) => match[1]);
  for (const image of galleryImages) {
    await validateReference(galleryBase + image);
  }

  const generatedGroups = [
    ...galleryScript.matchAll(
      /\{ length: (\d+) \},[\s\S]*?=> `([^`$]+)\$\{String\(index \+ 2\)\.padStart\(2, "0"\)\}\.webp`/g,
    ),
  ];
  for (const [, length, prefix] of generatedGroups) {
    if (Number(length) + 1 < 5) {
      errors.push(`Galeria ${prefix} possui menos de cinco fotos.`);
    }
    for (let index = 2; index <= Number(length) + 1; index += 1) {
      await validateReference(
        `${galleryBase}${prefix}${String(index).padStart(2, "0")}.webp`,
      );
    }
  }
}

for (const anchor of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
  if (!/rel="[^"]*noopener[^"]*"/i.test(anchor[0])) {
    errors.push(`Link externo sem rel="noopener": ${anchor[0]}`);
  }
}

if (/http:\/\//i.test(html)) {
  errors.push("O HTML contém uma referência HTTP sem criptografia.");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Site validado: ${checkedReferences.size} referências locais encontradas.`,
  );
}
