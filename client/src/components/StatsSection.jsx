import { useEffect, useCallback, useState } from "react";
import { leadsApi } from "../utils/api";
import { STATUS_CONFIG } from "../utils/constants";

function useStats(refreshKey) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await leadsApi.getStats();
      setStats(res.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshKey]);

  return { stats, loading };
}

function StatCard({ label, value, sub, colorClass, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <div className="stat-icon" style={{ background: "var(--surface-3)" }}>
          {icon}
        </div>
      </div>
      <div className={`stat-value ${colorClass}`}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default function StatsSection({ refreshKey }) {
  const { stats, loading } = useStats(refreshKey);

  if (loading) {
    return (
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card">
            <div
              className="skeleton"
              style={{ height: 12, width: "60%", marginBottom: 16 }}
            />
            <div className="skeleton" style={{ height: 32, width: "40%" }} />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const total = stats.total || 0;
  const barSegments = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    key,
    color: cfg.color,
    count: stats.byStatus[key] || 0,
    pct: total > 0 ? ((stats.byStatus[key] || 0) / total) * 100 : 0,
  }));

  return (
    <>
      <div className="stats-grid">
        <StatCard
          label="Total Leads"
          value={stats.total}
          sub="All time"
          colorClass="stat-accent"
          icon={<UsersIcon />}
        />
        <StatCard
          label="New This Week"
          value={stats.recentLeads}
          sub="Last 7 days"
          colorClass="stat-info"
          icon={<TrendingIcon />}
        />
        <StatCard
          label="Converted"
          value={stats.byStatus.Converted}
          sub={`${stats.conversionRate}% conversion rate`}
          colorClass="stat-success"
          icon={<CheckIcon />}
        />
        <StatCard
          label="Qualified"
          value={stats.byStatus.Qualified}
          sub="Ready to close"
          colorClass="stat-warning"
          icon={<StarIcon />}
        />
      </div>

      <div className="status-bar-card">
        <div className="status-bar-title">Pipeline Overview</div>
        <div className="status-bar-track">
          {barSegments.map(({ key, color, pct }) =>
            pct > 0 ? (
              <div
                key={key}
                className="status-bar-segment"
                style={{ width: `${pct}%`, background: color }}
                title={`${key}: ${stats.byStatus[key]}`}
              />
            ) : null,
          )}
          {total === 0 && (
            <div
              className="status-bar-segment"
              style={{ width: "100%", background: "var(--surface-3)" }}
            />
          )}
        </div>
        <div className="status-bar-legend">
          {barSegments.map(({ key, color, count }) => (
            <div key={key} className="legend-item">
              <span className="legend-dot" style={{ background: color }} />
              {key}{" "}
              <span style={{ color: "var(--text-3)", marginLeft: 2 }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const UsersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--accent)"
    strokeWidth="2"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TrendingIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--info)"
    strokeWidth="2"
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--success)"
    strokeWidth="2"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const StarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--warning)"
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
