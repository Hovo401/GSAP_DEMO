import { useTranslation } from "react-i18next";
import { brand, nav, socialLinks } from "../content/site";
import { useContactPanelStore } from "../store/useContactPanelStore";

export default function Footer() {
  const { t } = useTranslation();
  const openContact = useContactPanelStore((s) => s.openContact);
  const footerLinks = t("footer.links", { returnObjects: true }) as string[];
  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t-2 border-paper/15 bg-ink px-6 pt-16 pb-8 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-3xl uppercase">{brand.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-paper/50">
              {t("brand.tagline")}. {t("footer.note")}
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <nav className="flex flex-col gap-3">
              <p className="text-xs font-medium tracking-[0.3em] text-paper/35 uppercase">
                {t("footer.menu")}
              </p>
              {nav.map((item) =>
                item.panel === "contact" ? (
                  <button
                    key={item.key}
                    type="button"
                    onClick={openContact}
                    className="text-left text-sm text-paper/70 transition-colors duration-200 hover:text-flame"
                  >
                    {t(`nav.${item.key}`)}
                  </button>
                ) : (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={(e) => goTo(e, item.href!)}
                    className="text-sm text-paper/70 transition-colors duration-200 hover:text-flame"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                ),
              )}
            </nav>

            <nav className="flex flex-col gap-3">
              <p className="text-xs font-medium tracking-[0.3em] text-paper/35 uppercase">
                {t("footer.elsewhere")}
              </p>
              {footerLinks.map((link, index) => {
                const social = socialLinks[index];
                return (
                  <a
                    key={link}
                    href={social.href}
                    target={social.key === "email" ? undefined : "_blank"}
                    rel={social.key === "email" ? undefined : "noopener noreferrer"}
                    className="group flex items-center gap-2 text-sm text-paper/70 transition-colors duration-200 hover:text-flame"
                  >
                    {link}
                    <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      ↗
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-paper/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-paper/30">
            © {new Date().getFullYear()} {brand.name}. {t("footer.rightsNote")}
          </p>
          <button
            onClick={scrollTop}
            className="group flex cursor-pointer items-center gap-2 text-xs font-medium tracking-[0.2em] text-paper/50 uppercase transition-colors duration-200 hover:text-flame"
          >
            {t("footer.backToTop")}
            <span className="transition-transform duration-200 group-hover:-translate-y-1">
              ↑
            </span>
          </button>
        </div>

        <p
          aria-hidden="true"
          className="font-display pointer-events-none mt-10 -mb-[0.18em] w-full text-center text-[24vw] leading-[0.8] text-paper/[0.05] uppercase select-none"
        >
          {brand.name}
        </p>
      </div>
    </footer>
  );
}
