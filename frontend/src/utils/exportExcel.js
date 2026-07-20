import * as XLSX from "xlsx";

export function exportExcel(filename, rows) {
  const worksheet = XLSX.utils.json_to_sheet(
    rows.map((row) => ({
      "Order ID": `#${row.id}`,
      Table: `Table ${row.table}`,
      Items: row.items.map((item) => `${item.name || "Item"} x${item.qty ?? item.quantity ?? 1}`).join("; "),
      Subtotal: row.subtotal,
      Tax: row.tax,
      Discount: row.discount,
      Total: row.total,
      "Payment Method": row.paymentMethod,
      Time: row.time,
      Status: row.status,
    }))
  );
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, filename);
}
