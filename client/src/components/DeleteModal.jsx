import { useState } from "react";
import { leadsApi } from "../utils/api";
import toast from "react-hot-toast";

export default function DeleteModal({ lead, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await leadsApi.delete(lead._id);
      toast.success("Lead deleted");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h3>Delete Lead</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-confirm">
            <div className="delete-confirm-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <p>
              You're about to delete <strong>{lead.name}</strong> from{" "}
              <strong>{lead.company}</strong>. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
