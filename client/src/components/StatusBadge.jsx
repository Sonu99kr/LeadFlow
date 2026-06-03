import { STATUS_CONFIG } from "../utils/constants";

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.New;

  return (
    <span
      className="status-badge"
      style={{ color: config.color, background: config.bg }}
    >
      <span
        className="status-dot"
        style={{ background: config.color }}
      />
      {status}
    </span>
  );
}
