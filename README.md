# LeadFlow CRM

A full-stack Lead Management CRM built with React, Node.js/Express, and MongoDB.
Manage your entire sales pipeline — add leads, track statuses, filter and search, all from a clean dark-themed dashboard.

---

## Features

- **Lead CRUD** — create, view, edit, and delete leads
- **Status pipeline** — New → Contacted → Qualified → Converted → Lost
- **Dashboard stats** — total leads, weekly intake, conversion rate, pipeline bar
- **Search** — real-time search across name, email, and company (debounced)
- **Filter & sort** — filter by status, sort by any column, toggle direction
- **Pagination** — configurable page size (5 / 10 / 20 / 50)
- **Responsive design** — works on desktop, tablet, and mobile
- **Toast notifications** — success/error feedback on every action

---

## Tech Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | React 18, CSS Variables |
| Backend  | Node.js, Express 4      |
| Database | MongoDB via Mongoose    |
| HTTP     | Axios                   |
| Toasts   | react-hot-toast         |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/leadflow-crm.git
cd leadflow-crm
```

### 2. Install dependencies

```bash
npm run install:all
```

This runs `npm install` in the root, `server/`, and `client/` directories.

### 3. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5010
MONGO_URI=mongodb://localhost:27017/crm_leads
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGO_URI` with your connection string:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/crm_leads
```

### 4. Run in development

```bash
# from the project root — starts both server and client
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## API Reference

All endpoints are prefixed with `/api`.

### Leads

| Method | Endpoint     | Description               |
| ------ | ------------ | ------------------------- |
| GET    | /leads       | Get all leads (paginated) |
| GET    | /leads/stats | Dashboard statistics      |
| GET    | /leads/:id   | Get a single lead         |
| POST   | /leads       | Create a new lead         |
| PUT    | /leads/:id   | Update a lead             |
| DELETE | /leads/:id   | Delete a lead             |

### Query Parameters (GET /leads)

| Param  | Type   | Default     | Description                    |
| ------ | ------ | ----------- | ------------------------------ |
| search | string | ""          | Search name, email, or company |
| status | string | "All"       | Filter by status               |
| sortBy | string | "createdAt" | Sort field                     |
| order  | string | "desc"      | "asc" or "desc"                |
| page   | number | 1           | Page number                    |
| limit  | number | 10          | Results per page (max 100)     |

### Example request

```bash
curl "http://localhost:5000/api/leads?search=acme&status=Qualified&page=1&limit=5"
```

### Example response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 5,
    "totalPages": 3
  }
}
```

---

## Lead Fields

| Field     | Type   | Required | Notes                      |
| --------- | ------ | -------- | -------------------------- |
| name      | String | Yes      | Max 100 chars              |
| email     | String | Yes      | Unique, validated format   |
| phone     | String | Yes      | Max 20 chars               |
| company   | String | Yes      | Max 100 chars              |
| status    | String | No       | Default: "New"; enum above |
| notes     | String | No       | Max 1000 chars             |
| createdAt | Date   | Auto     | Set by MongoDB timestamps  |

---

## Project Structure

```
leadflow-crm/
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── errorHandler.js    # Centralised error handling
│   │   └── validate.js        # express-validator rules
│   ├── models/
│   │   └── Lead.js            # Mongoose schema + indexes
│   ├── routes/
│   │   └── leads.js           # All /api/leads routes
│   ├── .env.example
│   ├── index.js               # Express app entry point
│   └── package.json
│
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── DeleteModal.jsx
│       │   ├── LeadFormModal.jsx
│       │   ├── LeadsTable.jsx
│       │   ├── Sidebar.jsx
│       │   ├── StatsSection.jsx
│       │   └── StatusBadge.jsx
│       ├── hooks/
│       │   └── useLeads.js    # Data fetching hooks
│       ├── pages/
│       │   └── Dashboard.jsx
│       ├── utils/
│       │   ├── api.js         # Axios instance + endpoints
│       │   └── constants.js   # Statuses, defaults
│       ├── App.js
│       ├── index.css          # Design system + all styles
│       └── index.js
│
├── package.json               # Root scripts with concurrently
└── README.md
```

---

## Deployment

### Backend — Railway / Render

1. Set environment variables on your host (`MONGO_URI`, `PORT`, `CLIENT_URL`, `NODE_ENV=production`)
2. Set root directory to `server/`, start command `node index.js`

### Frontend — Vercel / Netlify

1. Set root directory to `client/`
2. Build command: `npm run build`
3. Publish directory: `build`
4. Set env var: `REACT_APP_API_URL=https://your-api-host.com/api`

---

## License

MIT
