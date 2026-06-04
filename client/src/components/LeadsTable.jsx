import StatusBadge from "./StatusBadge";
import { SORT_OPTIONS, LEAD_STATUSES } from "../utils/constants";

function SortIcon({ active, direction }) {
  if (!active) {
    return (
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ opacity: 0.35 }}
      >
        <path d="M12 5v14M5 12l7-7 7 7" />
      </svg>
    );
  }
  return direction === "asc" ? (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ) : (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

function SkeletonRows({ count = 5 }) {
  return [...Array(count)].map((_, i) => (
    <tr key={i} className="skeleton-row">
      {[...Array(6)].map((__, j) => (
        <td key={j}>
          <div
            className="skeleton"
            style={{
              height: 14,
              width: j === 0 ? "70%" : j === 5 ? "60px" : "80%",
            }}
          />
        </td>
      ))}
    </tr>
  ));
}

export default function LeadsTable({
  leads,
  loading,
  params,
  pagination,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  onLimitChange,
}) {
  const handleSort = (field) => {
    if (params.sortBy === field) {
      onSort(field, params.order === "asc" ? "desc" : "asc");
    } else {
      onSort(field, "asc");
    }
  };

  const renderSortTh = (label, field) => (
    <th
      className={params.sortBy === field ? "sorted" : ""}
      onClick={() => handleSort(field)}
    >
      <span className="th-inner">
        {label}
        <SortIcon active={params.sortBy === field} direction={params.order} />
      </span>
    </th>
  );

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const { total, page, totalPages, limit } = pagination || {};
  const start = total > 0 ? (page - 1) * limit + 1 : 0;
  const end = total > 0 ? Math.min(page * limit, total) : 0;

  const getPageRange = () => {
    if (!totalPages) return [];
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }
    if (page - delta > 2) range.unshift("...");
    if (page + delta < totalPages - 1) range.push("...");
    if (totalPages > 1) {
      range.unshift(1);
      range.push(totalPages);
    } else {
      range.unshift(1);
    }
    return [...new Set(range)];
  };

  return (
    <div className="table-card">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {renderSortTh("Lead", "name")}
              {renderSortTh("Company", "company")}
              <th>Contact</th>
              {renderSortTh("Status", "status")}
              {renderSortTh("Added", "createdAt")}
              <th style={{ width: 90 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows count={params.limit} />
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-3)"
                        strokeWidth="1.5"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h4>No leads found</h4>
                    <p>
                      {params.search || params.status !== "All"
                        ? "Try adjusting your search or filters."
                        : "Add your first lead to get started."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <div className="td-name">{lead.name}</div>
                  </td>
                  <td>{lead.company}</td>
                  <td>
                    <div style={{ fontSize: "0.875rem" }}>{lead.email}</div>
                    <div className="td-secondary">{lead.phone}</div>
                  </td>
                  <td>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td style={{ color: "var(--text-2)", whiteSpace: "nowrap" }}>
                    {formatDate(lead.createdAt)}
                  </td>
                  <td>
                    <div className="td-actions">
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => onEdit(lead)}
                        title="Edit lead"
                        aria-label="Edit"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => onDelete(lead)}
                        title="Delete lead"
                        aria-label="Delete"
                        style={{ color: "var(--danger)" }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && total > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing{" "}
            <strong>
              {start}–{end}
            </strong>{" "}
            of <strong>{total}</strong> leads
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <select
              className="select-field"
              value={params.limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              style={{ padding: "5px 28px 5px 8px", fontSize: "0.8rem" }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>

            <div className="pagination-controls">
              <button
                className="page-btn"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                aria-label="Previous"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {getPageRange().map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="page-btn"
                    style={{ cursor: "default", border: "none" }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? "active" : ""}`}
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                className="page-btn"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
