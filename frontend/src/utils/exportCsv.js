function escapeCsv(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export function exportCsv(filename, rows) {
  const headers = [
    "Order ID",
    "Table",
    "Items",
    "Subtotal",
    "Tax",
    "Discount",
    "Total",
    "Payment Method",
    "Time",
    "Status",
  ];

  const body = rows.map((row) => [
    `#${row.id}`,
    `Table ${row.table}`,
    row.items.map((item) => `${item.name || "Item"} x${item.qty ?? item.quantity ?? 1}`).join("; "),
    row.subtotal,
    row.tax,
    row.discount,
    row.total,
    row.paymentMethod,
    row.time,
    row.status,
  ]);

  const csv = [headers, ...body].map((line) => line.map(escapeCsv).join(",")).join("\n");
  const anchor = document.createElement("a");

  anchor.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  anchor.download = filename;
  anchor.click();
}
