import { useState, useCallback } from "react";
import { useLeads } from "../hooks/useLeads";
import { LEAD_STATUSES, SORT_OPTIONS } from "../utils/constants";
import StatsSection from "../components/StatsSection";
import LeadsTable from "../components/LeadsTable";
import LeadFormModal from "../components/LeadFormModal";
import DeleteModal from "../components/DeleteModal";

export default function Dashboard() {
  const {
    leads,
    pagination,
    params,
    loading,
    error,
    updateParams,
    setSearch,
    refresh,
  } = useLeads();

  const [editLead, setEditLead] = useState(null);
  const [deleteLead, setDeleteLead] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = useCallback(() => {
    refresh();
    setRefreshKey((k) => k + 1);
  }, [refresh]);

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Lead Management</h2>
          <p>Track and manage your sales pipeline</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Lead
        </button>
      </div>

      <StatsSection refreshKey={refreshKey} />

      <div className="toolbar">
        <div className="search-wrap">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            className="search-input"
            placeholder="Search by name, email, or company…"
            defaultValue={params.search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search leads"
          />
        </div>

        <select
          className="select-field"
          value={params.status}
          onChange={(e) => updateParams({ status: e.target.value })}
          aria-label="Filter by status"
        >
          <option value="All">All Statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="select-field"
          value={params.sortBy}
          onChange={(e) => updateParams({ sortBy: e.target.value })}
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "var(--radius)",
            color: "var(--danger)",
            fontSize: "0.875rem",
            marginBottom: 16,
          }}
        >
          {error} —{" "}
          <button
            onClick={refresh}
            style={{
              background: "none",
              border: "none",
              color: "var(--danger)",
              cursor: "pointer",
              textDecoration: "underline",
              font: "inherit",
            }}
          >
            retry
          </button>
        </div>
      )}

      <LeadsTable
        leads={leads}
        loading={loading}
        params={params}
        pagination={pagination}
        onSort={(field, direction) =>
          updateParams({ sortBy: field, order: direction })
        }
        onPageChange={(page) => updateParams({ page })}
        onLimitChange={(limit) => updateParams({ limit, page: 1 })}
        onEdit={setEditLead}
        onDelete={setDeleteLead}
      />

      {showCreate && (
        <LeadFormModal
          lead={null}
          onClose={() => setShowCreate(false)}
          onSuccess={handleSuccess}
        />
      )}

      {editLead && (
        <LeadFormModal
          lead={editLead}
          onClose={() => setEditLead(null)}
          onSuccess={handleSuccess}
        />
      )}

      {deleteLead && (
        <DeleteModal
          lead={deleteLead}
          onClose={() => setDeleteLead(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
