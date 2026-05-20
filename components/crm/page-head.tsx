import { Badge } from "@/components/ui/primitives";

export function PageHead({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="page-head">
      <div>
        {badge ? <span className="eyebrow">{badge}</span> : null}
        <h2 style={{ fontSize: "2rem", marginTop: 6 }}>{title}</h2>
        <p>{description}</p>
      </div>
      <Badge>AssetLift Lending</Badge>
    </div>
  );
}
