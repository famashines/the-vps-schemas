import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const jsonIn = (dir) => readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => join(dir, f));

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

const schemas = readdirSync(".", { recursive: true })
  .filter((f) => f.endsWith(".json") && !/^(examples|node_modules)\//.test(f) && !/^package(-lock)?\.json$/.test(f) && f !== "renovate.json");
const names = new Set();
let failures = 0;

for (const file of schemas) {
  const name = basename(file, ".json");
  names.add(name);
  const validate = ajv.compile(read(file));
  for (const kind of ["valid", "invalid"]) {
    let examples = [];
    try { examples = jsonIn(join("examples", name, kind)); } catch {}
    if (examples.length === 0) {
      console.log(`FAIL ${name}: no ${kind} example`);
      failures++;
    }
    for (const example of examples) {
      const ok = validate(read(example));
      if (ok === (kind === "valid")) {
        console.log(`ok   ${example}`);
      } else {
        console.log(`FAIL ${example}: expected ${kind}`, ok ? "" : ajv.errorsText(validate.errors));
        failures++;
      }
    }
  }
}

for (const dir of readdirSync("examples")) {
  if (!names.has(dir)) {
    console.log(`FAIL examples/${dir}: no schema with this name`);
    failures++;
  }
}

console.log(`${schemas.length} schemas, ${failures} failures`);
process.exitCode = failures ? 1 : 0;
