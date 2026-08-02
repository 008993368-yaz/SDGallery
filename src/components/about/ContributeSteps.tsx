import Link from "next/link";
import { GITHUB_REPO_URL } from "@/lib/constants";

const STEPS = [
  "Fork the repository and create a branch for your content.",
  "Add or update MDX under content/companies, content/patterns, or content/case-studies.",
  "Include required frontmatter, a Mermaid diagram, and cited Sources.",
  "Open a pull request using the checklist in CONTRIBUTING.md.",
];

export function ContributeSteps() {
  return (
    <ol className="list-decimal space-y-3 pl-5 text-slate-700">
      {STEPS.map((step) => (
        <li key={step}>{step}</li>
      ))}
      <li className="list-none pt-2">
        <Link
          href={GITHUB_REPO_URL}
          className="inline-flex rounded-md bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </Link>
      </li>
    </ol>
  );
}
