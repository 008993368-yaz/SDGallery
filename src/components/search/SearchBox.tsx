type SearchBoxProps = {
  className?: string;
  size?: "default" | "large";
};

export function SearchBox({ className = "", size = "default" }: SearchBoxProps) {
  const inputClass =
    size === "large"
      ? "h-14 rounded-xl px-5 text-base shadow-sm"
      : "h-11 rounded-lg px-4 text-sm";

  return (
    <form
      method="get"
      action="/search"
      className={`group relative w-full ${className}`}
      role="search"
    >
      <label htmlFor="home-search-q" className="sr-only">
        Search a company or pattern
      </label>
      <input
        id="home-search-q"
        type="search"
        name="q"
        placeholder="Search a company or pattern"
        className={`w-full border border-slate-200 bg-white text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 ${inputClass}`}
      />
      <button
        type="submit"
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        Search
      </button>
    </form>
  );
}
