import { Download, FileSpreadsheet, FileText, Sheet } from "lucide-react";

export default function ExportMenu({ onCsv, onExcel, onPdf, disabled }) {
  return (
    <div className="flex w-full min-w-0 flex-wrap gap-2 sm:w-auto sm:justify-end">
      <button
        onClick={onCsv}
        disabled={disabled}
        className="inline-flex min-w-[88px] flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 py-3 text-sm font-semibold text-[var(--cream)] transition-all duration-300 hover:border-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
      >
        <Sheet className="h-4 w-4 text-[var(--gold)]" />
        CSV
      </button>
      <button
        onClick={onExcel}
        disabled={disabled}
        className="inline-flex min-w-[96px] flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 py-3 text-sm font-semibold text-[var(--cream)] transition-all duration-300 hover:border-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
      >
        <FileSpreadsheet className="h-4 w-4 text-emerald-300" />
        Excel
      </button>
      <button
        onClick={onPdf}
        disabled={disabled}
        className="inline-flex min-w-[88px] flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card2)] px-4 py-3 text-sm font-semibold text-[var(--cream)] transition-all duration-300 hover:border-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
      >
        <FileText className="h-4 w-4 text-red-300" />
        PDF
      </button>
      <div className="hidden items-center rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold-dim)] px-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)] xl:inline-flex">
        <Download className="mr-2 h-4 w-4" />
        Export
      </div>
    </div>
  );
}
