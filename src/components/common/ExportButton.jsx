import { Download } from "lucide-react";
import { downloadCSV } from "@/utils/format";

export default function ExportButton({
  rows,
  filename = "export.csv",
  headers,
  label = "Export CSV",
}) {
  return (
    <button
      className="btn-secondary"
      onClick={() => downloadCSV(filename, rows, headers)}
      disabled={!rows || rows.length === 0}
    >
      <Download size={15} />
      {label}
    </button>
  );
}
