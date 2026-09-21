import React from "react";
import { useNavigate } from "react-router-dom";
import { useReports } from "../components/useReports";
import { useAuth } from "../context/AuthContext";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function MyUploads() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reports, loading } = useReports();

  const name = user?.displayName || "Authority";

  return (
    <div className="my-uploads-page">
      <header className="uploads-header">
        <div>
          <h1>My Uploads</h1>
          <p>View and manage previously uploaded infrastructure images</p>
        </div>

        <div className="authority">
          <span>{name}</span>
          <div className="authority-avatar">{name[0]}</div>
        </div>
      </header>

      <div className="uploads-summary">
        <div className="summary-card">
          <span>Total Uploads</span>
          <strong>{reports.length}</strong>
          <small>Infrastructure assessments</small>
        </div>

        <div className="summary-card">
          <span>Analysed</span>
          <strong>{reports.length}</strong>
          <small>Analysis completed</small>
        </div>

        <div className="summary-card">
          <span>Pending</span>
          <strong>0</strong>
          <small>Awaiting analysis</small>
        </div>
      </div>

      <div className="uploads-action">
        <button
          type="button"
          onClick={() => navigate("/upload")}
          className="new-upload-button"
        >
          + Upload New Image
        </button>
      </div>

      <section className="uploads-card">
        <div className="section-heading">
          <div>
            <h2>Recent Uploads</h2>
            <p>Your recently submitted infrastructure assessments</p>
          </div>
        </div>

        <div className="upload-list">
          {loading && <p>Loading...</p>}

          {!loading && reports.length === 0 && (
            <p>No uploads yet. Click "Upload New Image" to add one.</p>
          )}

          {reports.map((item) => (
            <div className="upload-item" key={item.id}>
              <div className="upload-image-placeholder">🖼</div>

              <div className="upload-details">
                <div className="upload-title-row">
                  <h3>{item.location}</h3>
                  <span className={`priority-badge ${item.priority?.toLowerCase()}`}>
                    {item.priority}
                  </span>
                </div>

                <div className="upload-meta">
                  <span>{item.type}</span>
                  <span>•</span>
                  <span>{formatDate(item.date)}</span>
                  <span>•</span>
                  <span>Analysis Complete</span>
                </div>
              </div>

              <button
                type="button"
                className="view-button"
                onClick={() => navigate("/analysis")}
              >
                View Analysis →
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MyUploads;