import { useNavigate } from "react-router-dom";
import { useReports } from "../components/useReports";
import { useAuth } from "../context/AuthContext";
import "./MyUploads.css";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const severityClass = (severity) => {
  const normalized = String(severity || "").toLowerCase();
  return ["critical", "high", "medium", "low"].includes(normalized)
    ? `sf-badge-${normalized}`
    : "sf-badge-unknown";
};

function MyUploads() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reports, loading } = useReports();

  const name = user?.displayName || "Authority";

  return (
    <div className="uploads-page">
      <header className="uploads-page-header">
        <div>
          <p className="uploads-eyebrow">SAFEINFRA / RECORDS</p>
          <h1 className="sf-page-title">My uploads</h1>
          <p className="uploads-description">
            Review your submitted infrastructure inspections.
          </p>
        </div>
        <div className="uploads-header-actions">
          <span className="uploads-user-name">{name}</span>
          <span className="uploads-avatar" aria-hidden="true">{name[0]}</span>
          <button
            className="sf-button sf-button-primary"
            type="button"
            onClick={() => navigate("/upload")}
          >
            <span aria-hidden="true">+</span> New upload
          </button>
        </div>
      </header>

      <section className="uploads-records sf-card" aria-labelledby="uploads-records-title">
        <div className="uploads-records-heading">
          <div>
            <h2 className="sf-section-title" id="uploads-records-title">Inspection records</h2>
            <p className="sf-meta">Your submitted infrastructure assessments</p>
          </div>
          <span className="uploads-record-count" aria-live="polite">
            {loading ? "Loading" : `${reports.length} ${reports.length === 1 ? "record" : "records"}`}
          </span>
        </div>

        {loading ? (
          <div className="uploads-state" role="status" aria-live="polite">
            <span className="uploads-spinner" aria-hidden="true" />
            Loading your uploads...
          </div>
        ) : reports.length === 0 ? (
          <div className="uploads-state uploads-empty-state">
            <span className="uploads-empty-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M9 9h.01" /></svg>
            </span>
            <h3>No inspection records yet</h3>
            <p>Your submitted inspections will appear here.</p>
            <button className="sf-button sf-button-secondary" type="button" onClick={() => navigate("/upload")}>
              Start an upload
            </button>
          </div>
        ) : (
          <ul className="uploads-record-list">
            {reports.map((item) => (
              <li className="uploads-record" key={item.id}>
                <div className="uploads-image-placeholder" role="img" aria-label="Image is not available in saved report data">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M9 9h.01" />
                  </svg>
                  <span>Image not stored</span>
                </div>
                <div className="uploads-record-details">
                  <div className="uploads-record-title-row">
                    <h3>{item.location || "Location not specified"}</h3>
                    <span className={`sf-badge ${severityClass(item.severity)}`}>
                      {item.severity || "Unknown"}
                    </span>
                  </div>
                  <div className="uploads-record-meta">
                    <span>{item.type || "Infrastructure"}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>Report {item.id}</span>
                  </div>
                  <span className={`uploads-priority uploads-priority--${item.priority?.toLowerCase() || "unknown"}`}>
                    <span aria-hidden="true" /> Priority: {item.priority || "Unknown"}
                  </span>
                </div>
                <button
                  className="sf-button sf-button-secondary uploads-view-button"
                  type="button"
                  onClick={() => navigate("/analysis")}
                >
                  View analysis <span aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default MyUploads;