import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-tight text-slate-900">
        {SITE_NAME}
      </h1>
      <p className="mt-3 text-lg text-slate-600">{SITE_TAGLINE}</p>
    </div>
  );
}
