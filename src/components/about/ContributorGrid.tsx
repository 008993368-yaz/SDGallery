import Image from "next/image";
import Link from "next/link";
import type { Contributor } from "@/lib/types";

export function ContributorGrid({ contributors }: { contributors: Contributor[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {contributors.map((person) => (
        <li
          key={person.name}
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4"
        >
          <Image
            src={person.avatar}
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-medium text-slate-900">{person.name}</p>
            {person.github ? (
              <Link
                href={person.github}
                className="text-sm text-teal-700 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
