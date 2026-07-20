import { QRCodeSVG } from "qrcode.react"; // 🔥 PURE REACT DEPENDENCY FOR MULTI-RESOLUTION
import Modal from "../../../components/ui/Modal";

export default function QRModal({ table, onClose, showToast }) {
  const currentTableNum = table ? table.tableNumber || table.tableNo : "";
  const url = table
    ? `${window.location.origin}/?table=${currentTableNum}`
    : "";

  // Download PNG handling via SVG rendering buffer
  const download = () => {
    const svg = document.getElementById(`svg-table-qr-${currentTableNum}`);
    if (!svg) {
      showToast("QR Code element not found", "error");
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 256;
      canvas.height = 256;
      // Background clean validation render
      ctx.fillStyle = "#161411"; // Light layer background mapping matches UI themes
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 18, 18, 220, 220); // Dynamic center alignment inside grid bounds

      const pngFile = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = `table-${currentTableNum}-qr.png`;
      a.href = pngFile;
      a.click();
      showToast("QR downloaded successfully!", "success");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const copy = () => {
    if (!url) return;
    navigator.clipboard
      ?.writeText(url)
      .then(() => showToast("URL copied!", "success"))
      .catch(() => showToast("Failed to copy URL", "error"));
  };

  return (
    <Modal
      open={Boolean(table)}
      title={`QR Code - Table ${currentTableNum || ""}`}
      subtitle="Customers scan this to open the hotel menu"
      onClose={onClose}
    >
      {/* QR CONTAINER */}
      <div className="my-5 flex justify-center rounded-xl border border-[var(--border)] bg-[#161411] p-6 shadow-inner">
        {table && (
          <QRCodeSVG
            id={`svg-table-qr-${currentTableNum}`}
            value={url}
            size={180}
            fgColor="#d4aa5a" // Gold theme color match code
            bgColor="#161411" // Dark interface background
            level="H" // High error correction capacity bounds
            includeMargin={true}
          />
        )}
      </div>

      {/* DISPLAY URL */}
      <div className="mb-4 break-all rounded-lg border border-[var(--border)] bg-[var(--card2)] p-2.5 text-center text-[11px] text-mesa-muted font-mono selection:bg-[var(--gold)] selection:text-black">
        {url}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2">
        <button
          className="btn-primary flex-1 cursor-pointer"
          onClick={download}
        >
          📥 Download QR
        </button>
        <button className="btn-secondary cursor-pointer" onClick={copy}>
          🔗 Copy URL
        </button>
      </div>
    </Modal>
  );
}
