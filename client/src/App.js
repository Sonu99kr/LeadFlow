import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="main-content">
        {activePage === "dashboard" || activePage === "leads" ? (
          <Dashboard />
        ) : null}
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--surface-2)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
          },
          success: {
            iconTheme: { primary: "var(--success)", secondary: "var(--surface-2)" },
          },
          error: {
            iconTheme: { primary: "var(--danger)", secondary: "var(--surface-2)" },
          },
        }}
      />
    </div>
  );
}
