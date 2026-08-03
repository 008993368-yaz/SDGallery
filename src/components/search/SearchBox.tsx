type SearchBoxProps = {
  className?: string;
  size?: "default" | "large";
  defaultValue?: string;
};

export function SearchBox({
  className = "",
  size = "default",
  defaultValue = "",
}: SearchBoxProps) {
  const inputClass =
    size === "large"
      ? "h-16 rounded-2xl pl-12 pr-28 text-base shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)]"
      : "h-12 rounded-xl pl-11 pr-24 text-sm";

  return (
    <form
      method="get"
      action="/search"
      className={`group relative w-full ${className}`}
      role="search"
    >
      <label htmlFor="search-q" className="sr-only">
        Search a company or pattern
      </label>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            d="M9 3.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Zm0 0v0Zm7.5 12.5-3.36-3.36"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <input
        id="search-q"
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search a company or pattern"
        className={`w-full border border-white/70 bg-white/90 text-slate-900 outline-none transition placeholder:text-slate-400 ring-1 ring-slate-900/5 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${inputClass}`}
      />
      <button
        type="submit"
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-1/2 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Search
      </button>
    </form>
  );
}
