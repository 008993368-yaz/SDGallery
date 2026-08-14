import { validateAllContent } from "../src/lib/validate-content";

const issues = validateAllContent();

if (issues.length === 0) {
  console.log("All content passed validation.");
  process.exit(0);
}

for (const issue of issues) {
  console.error(`${issue.file}: ${issue.path}: ${issue.message}`);
}

console.error(`\n${issues.length} content validation issue(s) found.`);
process.exit(1);
