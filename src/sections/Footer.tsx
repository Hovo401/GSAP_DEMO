import { brand, footer } from "../content/site";

export default function Footer() {
  return (
    <footer className="border-t-2 border-paper/15 bg-ink px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="font-display text-3xl uppercase">{brand.name}</p>
          <p className="mt-1 text-sm text-paper/50">{footer.note}</p>
        </div>
        <nav className="flex flex-wrap gap-6">
          {footer.links.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium tracking-wide text-paper/70 uppercase transition-colors duration-200 hover:text-flame"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-paper/30">
        © {new Date().getFullYear()} {brand.name}. All motion reserved.
      </p>
    </footer>
  );
}
