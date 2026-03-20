import { t } from "#app/lib/i18n.js";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs = ({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) => (
  <nav
    aria-label={t("Breadcrumbs")}
    className={`sr-only not-prose mb-4 text-sm text-text-muted${className ? ` ${className}` : ""}`}
  >
    <ol className="flex items-center gap-1.5">
      {items.map((item, i) => (
        <li key={item.label} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true">/</span>}
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-text-strong motion-safe:transition-colors motion-safe:duration-150"
            >
              {item.label}
            </a>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);
