import { Card, Badge } from "@/components/ui/primitives";

type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
};

export function RecordTable<T>({
  title,
  rows,
  columns,
}: {
  title: string;
  rows: T[];
  columns: Column<T>[];
}) {
  return (
    <Card>
      <div className="table-title-row">
        <h3>{title}</h3>
        <Badge>{rows.length} records</Badge>
      </div>
      <div className="table-wrap">
        <table className="record-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
