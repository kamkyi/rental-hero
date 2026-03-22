import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

test("biome enforces unused variable and import rules", () => {
  const biomeConfig = readJson("biome.json");
  const correctnessRules = biomeConfig.linter?.rules?.correctness;

  assert.equal(correctnessRules?.noUnusedVariables, "error");
  assert.equal(correctnessRules?.noUnusedImports, "error");
});

test("husky pre-commit runs lint and tests", () => {
  const hook = readFileSync(".husky/pre-commit", "utf8");

  assert.match(hook, /npm run lint:fix/);
  assert.match(hook, /npm run lint/);
  assert.match(hook, /npm run test/);
});
