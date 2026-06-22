import { useId } from "react";

export default function VisitBadge({ label = "Visit project" }: { label?: string }) {
  const rawId = useId();
  const pathId = `visit-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const ring = ` ${label} • ${label} • `.toUpperCase();

  return (
    <div className="pointer-events-none relative h-32 w-32 md:h-40 md:w-40">
      <svg
        viewBox="0 0 200 200"
        className="badge-spin absolute inset-0 h-full w-full"
      >
        <defs>
          <path
            id={pathId}
            fill="none"
            d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"
          />
        </defs>
        <text
          className="fill-paper font-semibold uppercase"
          style={{ fontSize: "15px", letterSpacing: "0.16em" }}
        >
          <textPath href={`#${pathId}`} startOffset="0">
            {ring}
          </textPath>
        </text>
      </svg>

      <div className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-flame text-2xl text-ink md:h-20 md:w-20">
        →
      </div>
    </div>
  );
}
