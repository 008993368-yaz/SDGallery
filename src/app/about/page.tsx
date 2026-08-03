import type { Metadata } from "next";
import Image from "next/image";
import { ContributeSteps } from "@/components/about/ContributeSteps";
import { ContributorGrid } from "@/components/about/ContributorGrid";
import { GITHUB_REPO_URL, SITE_NAME } from "@/lib/constants";
import { getContributors } from "@/lib/content";

export const metadata: Metadata = {
  title: `About · ${SITE_NAME}`,
  description: "Free, open, community-built system design education.",
};

const SOURCE_LOGOS = [
  { name: "Netflix Tech Blog", src: "/logos/netflix.svg" },
  { name: "Uber Engineering", src: "/logos/uber.svg" },
  { name: "YouTube / Google", src: "/logos/youtube.svg" },
  { name: "Cloudflare Blog", src: "/logos/cloudflare.svg" },
];

export default function AboutPage() {
  const contributors = getContributors();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:py-16">
      <section className="max-w-3xl rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          About {SITE_NAME}
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-slate-900 sm:text-5xl">
          Free, open, community-built system design education
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          SDGallery helps beginners learn how large systems work through visuals
          and plain-language case studies drawn from public engineering blogs
          and talks—not insider leaks.
        </p>
      </section>

      <section className="mt-14 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur sm:p-8">
        <h2 className="font-display text-2xl text-slate-900">How content is sourced</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Explanations are synthesized from public sources such as company eng
          blogs. Every case study cites further reading so you can go deeper.
        </p>
        <ul className="mt-6 flex flex-wrap gap-6">
          {SOURCE_LOGOS.map((logo) => (
            <li key={logo.name} className="flex items-center gap-2 text-sm text-slate-700">
              <Image src={logo.src} alt="" width={32} height={32} />
              <span>{logo.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur sm:p-8">
        <h2 className="font-display text-2xl text-slate-900">How to Contribute</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Content lives as MDX in GitHub. Improvements ship as pull requests.
        </p>
        <div className="mt-6 max-w-2xl">
          <ContributeSteps />
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Repository:{" "}
          <a href={GITHUB_REPO_URL} className="text-teal-700 hover:underline">
            {GITHUB_REPO_URL}
          </a>
        </p>
      </section>

      <section className="mt-14 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm ring-1 ring-slate-900/5 backdrop-blur sm:p-8">
        <h2 className="font-display text-2xl text-slate-900">Contributors</h2>
        <div className="mt-6">
          <ContributorGrid contributors={contributors} />
        </div>
      </section>
    </div>
  );
}
