import Link from "next/link";

interface Column<T> {
  header: string;
  /** Render del cell. */
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowHref?: (row: T) => string;
  /** Celda de acciones por fila — se renderiza FUERA del Link para evitar anidamiento. */
  actionCell?: (row: T) => React.ReactNode;
  emptyMessage?: string;
}

/**
 * Tabla generica reutilizable. Server component (no state). Para click-on-row
 * usar `rowHref` que envuelve el contenido en un Link.
 */
export function AdminTable<T extends { id?: string | number }>({
  columns,
  rows,
  rowHref,
  actionCell,
  emptyMessage,
}: AdminTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="border border-dashed border-white/[0.08] bg-[#0a0a0a] px-6 py-16 text-center text-[13px] text-white/40">
        {emptyMessage ?? "Sin resultados."}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-white/[0.08] bg-[#131313]">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-white/[0.08]">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
            {actionCell && <th className="px-3 py-3" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <Row
              key={row.id ?? i}
              row={row}
              columns={columns}
              href={rowHref?.(row)}
              actionCell={actionCell}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row<T>({
  row,
  columns,
  href,
  actionCell,
}: {
  row: T;
  columns: Column<T>[];
  href?: string;
  actionCell?: (row: T) => React.ReactNode;
}) {
  const cells = columns.map((col, i) => (
    <td
      key={i}
      className={`px-5 py-3 align-middle text-white/80 ${col.className ?? ""}`}
    >
      {col.cell(row)}
    </td>
  ));

  const actionTd = actionCell ? (
    <td className="px-3 py-2 align-middle">
      {actionCell(row)}
    </td>
  ) : null;

  if (href) {
    return (
      <tr className="group border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.02]">
        {cells.map((cell, i) => (
          <td
            key={i}
            className="p-0"
            style={{ borderColor: "transparent" }}
          >
            <Link
              href={href}
              className={`flex h-full items-center px-5 py-3 ${columns[i].className ?? ""} text-white/80 group-hover:text-white`}
            >
              {columns[i].cell(row)}
            </Link>
          </td>
        ))}
        {actionTd}
      </tr>
    );
  }

  return (
    <tr className="border-b border-white/[0.04] last:border-0">
      {cells}
      {actionTd}
    </tr>
  );
}
