import fs from "node:fs";
import path from "node:path";

const filePath = path.resolve(process.cwd(), "src/index.html");
const html = fs.readFileSync(filePath, "utf8");

const checks = [];

function addCheck(name, passed, details) {
  checks.push({ name, passed, details });
}

addCheck(
  "Documento define atributo lang",
  /<html[^>]*\slang=\"[^\"]+\"/i.test(html),
  "Debe existir lang en html"
);

addCheck(
  "Existe meta description",
  /<meta[^>]*name=\"description\"[^>]*>/i.test(html),
  "Ayuda SEO y accesibilidad contextual"
);

addCheck(
  "Existe etiqueta main",
  /<main[\s>]/i.test(html) && /<\/main>/i.test(html),
  "Debe haber un contenedor principal"
);

const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
const missingAlt = imgTags.filter((tag) => !/\salt=\"[^\"]*\"/i.test(tag));
addCheck(
  "Todas las imagenes tienen alt",
  missingAlt.length === 0,
  missingAlt.length ? `Sin alt: ${missingAlt.length}` : `${imgTags.length} imagen(es) con alt`
);

const labels = [...html.matchAll(/<label[^>]*for=\"([^\"]+)\"[^>]*>/gi)].map((m) => m[1]);
const inputs = [...html.matchAll(/<(input|textarea)\b[^>]*id=\"([^\"]+)\"[^>]*>/gi)].map((m) => m[2]);
const unlabeled = inputs.filter((id) => !labels.includes(id));
addCheck(
  "Campos de formulario vinculados a label",
  unlabeled.length === 0,
  unlabeled.length ? `Sin label: ${unlabeled.join(", ")}` : `${inputs.length} campo(s) etiquetados`
);

const buttonMatches = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
const emptyButtons = buttonMatches.filter((match) => {
  const attributes = match[1] || "";
  const text = (match[2] || "").replace(/<[^>]+>/g, "").trim();
  const hasAriaLabel = /aria-label=\"[^\"]+\"/i.test(attributes);
  return text.length === 0 && !hasAriaLabel;
});
addCheck(
  "Botones tienen texto accesible",
  emptyButtons.length === 0,
  emptyButtons.length ? `Botones sin texto ni aria-label: ${emptyButtons.length}` : `${buttonMatches.length} boton(es) ok`
);

const passed = checks.filter((c) => c.passed).length;
const failed = checks.length - passed;

console.log("\nWCAG AA Automation Checklist\n");
checks.forEach((check) => {
  const icon = check.passed ? "PASS" : "FAIL";
  console.log(`- [${icon}] ${check.name} -> ${check.details}`);
});

console.log(`\nSummary: ${passed}/${checks.length} passed, ${failed} failed.`);

if (failed > 0) {
  process.exitCode = 1;
}
