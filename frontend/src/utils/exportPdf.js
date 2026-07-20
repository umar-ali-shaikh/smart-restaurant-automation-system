import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportPdf(filename, rows, title = "Billing Transactions") {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(16);
  doc.text(title, 14, 16);

  autoTable(doc, {
    startY: 24,
    head: [
      [
        "Order ID",
        "Table",
        "Items",
        "Subtotal",
        "Tax",
        "Discount",
        "Total",
        "Payment",
        "Time",
        "Status",
      ],
    ],
    body: rows.map((row) => [
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
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [33, 29, 24],
      textColor: [245, 237, 224],
    },
  });

  doc.save(filename);
}
