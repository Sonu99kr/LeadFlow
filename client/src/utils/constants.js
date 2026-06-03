export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Converted", "Lost"];

export const STATUS_CONFIG = {
  New:        { color: "#6366f1", bg: "rgba(99,102,241,0.12)",  label: "New"        },
  Contacted:  { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  label: "Contacted"  },
  Qualified:  { color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  label: "Qualified"  },
  Converted:  { color: "#10b981", bg: "rgba(16,185,129,0.12)",  label: "Converted"  },
  Lost:       { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   label: "Lost"       },
};

export const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Added"   },
  { value: "name",      label: "Name"         },
  { value: "company",   label: "Company"      },
  { value: "status",    label: "Status"       },
];

export const DEFAULT_PARAMS = {
  page:    1,
  limit:   10,
  sortBy:  "createdAt",
  order:   "desc",
  search:  "",
  status:  "All",
};
