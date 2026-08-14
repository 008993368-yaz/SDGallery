import Link from "next/link";
import type { Difficulty } from "@/lib/types";

type PrerequisiteLink = {
  href: string;
  label: string;
};

type LearningMetaProps = {
  difficulty: Difficulty;
  estimatedReadingMinutes: number;
  learningObjectives: string[];
  prerequisites: PrerequisiteLink[];
};

export function LearningMeta({
  difficulty,
  estimatedReadingMinutes,
  learningObjectives,
  prerequisites,
}: LearningMetaProps) {
  return (
    <div className="mt-4 space-y-4">
      <p className="flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
        <span className="capitalize">{difficulty}</span>
        <span aria-hidden="true">·</span>
        <span>{estimatedReadingMinutes} min read</span>
      </p>

      {learningObjectives.length > 0 ? (
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            What you’ll learn
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {learningObjectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {prerequisites.length > 0 ? (
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">Prerequisites:</span>{" "}
          {prerequisites.map((item, index) => (
            <span key={item.href}>
              {index > 0 ? ", " : null}
              <Link
                href={item.href}
                className="text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-teal-700"
              >
                {item.label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
