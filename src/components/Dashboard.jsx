import { useNavigate } from "react-router-dom";
import { useReports } from "./useReports";
import { useAuth } from "../context/AuthContext";

import "leaflet/dist/leaflet.css";
import "./Dashboard.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";


// ==========================================
// MARKER ICON
// ==========================================

const createMarkerIcon = (priority) => {
  const colors = {
    Critical: "#DC2626",
    High: "#F97316",
    Medium: "#EAB308",
    Low: "#16A34A",
  };

  return L.divIcon({
    className: "safeinfra-marker",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        background: ${colors[priority] || "#06B6D4"};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};


// ==========================================
// KNOWN LOCATION COORDINATES
// ==========================================

const locationCoordinates = {
  ramapuram: [13.0324, 80.1809],

  rajasthan: [27.0238, 74.2179],
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function Dashboard() {

  const navigate = useNavigate();

  const { reports, stats, loading } = useReports();

  const { user } = useAuth();

  const name = user?.displayName || "Srinithi";


  // ==========================================
  // PRIORITY ORDER
  // ==========================================

  const rank = {
    Critical: 0,
    High: 1,
    Medium: 2,
    Low: 3,
  };


  const priorityLocations = [...reports]
    .sort(
      (a, b) =>
        (rank[a.priority] ?? 4) -
          (rank[b.priority] ?? 4) ||
        new Date(b.date) - new Date(a.date)
    )
    .slice(0, 5)
    .map((r) => {

      const location =
        String(r.location || "").trim();

      const key =
        location.toLowerCase();


      let coordinates =
        locationCoordinates[key];


      // ------------------------------------------
      // Handle "Ramapuram, Chennai"
      // ------------------------------------------

      if (!coordinates && key.includes("ramapuram")) {
        coordinates =
          locationCoordinates.ramapuram;
      }


      // ------------------------------------------
      // Handle "Rajasthan"
      // ------------------------------------------

      if (!coordinates && key.includes("rajasthan")) {
        coordinates =
          locationCoordinates.rajasthan;
      }


      return {
        id: r.id,
        type: r.type,
        location: location,
        priority: r.priority,
        date: r.date,
        coordinates: coordinates,
      };

    });


  // ==========================================
  // PRIORITY COLORS
  // ==========================================

  const priorityStyles = {

    Critical: {
      background: "#FEF2F2",
      color: "#B91C1C",
    },

    High: {
      background: "#FFF7ED",
      color: "#C2410C",
    },

    Medium: {
      background: "#FEFCE8",
      color: "#A16207",
    },

    Low: {
      background: "#F0FDF4",
      color: "#15803D",
    },

  };


  if (loading) {
    return (
      <div className="dashboard-page dashboard-loading" role="status" aria-live="polite">
        <span className="dashboard-loading-indicator" aria-hidden="true" />
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-heading">
          <p className="dashboard-eyebrow">SAFEINFRA / OPERATIONS</p>
          <h1 className="sf-page-title">Welcome, {name}</h1>
          <p className="dashboard-subtitle">
            Infrastructure monitoring and disaster response dashboard
          </p>
        </div>
        <button
          className="sf-button sf-button-primary dashboard-reports-button"
          type="button"
          onClick={() => navigate("/reports")}
        >
          View reports
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </button>
      </header>

      <section className="dashboard-metrics" aria-label="Report summary">
        <article className="dashboard-metric sf-card dashboard-metric--cyan">
          <div className="dashboard-metric-heading"><span className="dashboard-metric-dot" aria-hidden="true" /><span className="dashboard-metric-label">Total reports</span></div>
          <strong className="dashboard-metric-value">{stats?.total ?? reports.length}</strong>
          <span className="dashboard-metric-detail">All inspection records</span>
        </article>
        <article className="dashboard-metric sf-card dashboard-metric--critical">
          <div className="dashboard-metric-heading"><span className="dashboard-metric-dot" aria-hidden="true" /><span className="dashboard-metric-label">Critical</span></div>
          <strong className="dashboard-metric-value">{stats?.critical ?? reports.filter((report) => report.priority === "Critical").length}</strong>
          <span className="dashboard-metric-detail">Immediate attention</span>
        </article>
        <article className="dashboard-metric sf-card dashboard-metric--high">
          <div className="dashboard-metric-heading"><span className="dashboard-metric-dot" aria-hidden="true" /><span className="dashboard-metric-label">High priority</span></div>
          <strong className="dashboard-metric-value">{stats?.high ?? reports.filter((report) => report.priority === "High").length}</strong>
          <span className="dashboard-metric-detail">Priority follow-up</span>
        </article>
        <article className="dashboard-metric sf-card dashboard-metric--locations">
          <div className="dashboard-metric-heading"><span className="dashboard-metric-dot" aria-hidden="true" /><span className="dashboard-metric-label">Locations</span></div>
          <strong className="dashboard-metric-value">{priorityLocations.length}</strong>
          <span className="dashboard-metric-detail">In current priority list</span>
        </article>
      </section>

      <div className="dashboard-content-grid">
        <section className="dashboard-panel dashboard-map-panel sf-card" aria-labelledby="dashboard-map-title">
          <div className="dashboard-panel-header">
            <div>
              <p className="dashboard-section-kicker">GEOGRAPHIC VIEW</p>
              <h2 className="sf-section-title" id="dashboard-map-title">Infrastructure priority map</h2>
              <p className="sf-meta dashboard-panel-description">Reported infrastructure issues by location</p>
            </div>
            <div className="dashboard-legend" aria-label="Map priority legend">
              {Object.entries({ Critical: "#DC2626", High: "#F97316", Medium: "#EAB308", Low: "#16A34A" }).map(([priority, color]) => (
                <span className="dashboard-legend-item" key={priority}>
                  <span className="dashboard-legend-dot" style={{ "--legend-color": color }} aria-hidden="true" />
                  {priority}
                </span>
              ))}
            </div>
          </div>

          <div className="dashboard-map" aria-label="Map showing known infrastructure report locations">
            <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {priorityLocations.map((item) => {
                if (!item.coordinates) return null;

                return (
                  <Marker key={item.id} position={item.coordinates} icon={createMarkerIcon(item.priority)}>
                    <Popup>
                      <div className="dashboard-map-popup">
                        <strong>{item.type}</strong>
                        <div><b>Location:</b> {item.location}</div>
                        <div>
                          <b>Priority:</b>{" "}
                          <span style={{ color: priorityStyles[item.priority]?.color, fontWeight: 700 }}>
                            {item.priority}
                          </span>
                        </div>
                        <small>Coordinates: {item.coordinates[0].toFixed(4)}, {item.coordinates[1].toFixed(4)}</small>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </section>

        <section className="dashboard-panel dashboard-reports-panel sf-card" aria-labelledby="dashboard-reports-title">
          <div className="dashboard-panel-header dashboard-reports-heading">
            <div>
              <p className="dashboard-section-kicker">ATTENTION QUEUE</p>
              <h2 className="sf-section-title" id="dashboard-reports-title">Recent priority reports</h2>
              <p className="sf-meta dashboard-panel-description">Highest priority first, then newest</p>
            </div>
            <span className="dashboard-report-count" aria-label={`${priorityLocations.length} reports shown`}>
              {priorityLocations.length}
            </span>
          </div>

          {priorityLocations.length === 0 ? (
            <div className="dashboard-empty-state">
              <span className="dashboard-empty-mark" aria-hidden="true">—</span>
              <p>No reports available.</p>
            </div>
          ) : (
            <ul className="dashboard-report-list">
              {priorityLocations.map((item) => (
                <li className="dashboard-report-row" key={item.id}>
                  <span className={`dashboard-report-marker dashboard-report-marker--${String(item.priority || "").toLowerCase()}`} aria-hidden="true" />
                  <div className="dashboard-report-details">
                    <strong className="dashboard-report-location">{item.location}</strong>
                    <span className="dashboard-report-meta">{item.type}<span aria-hidden="true">·</span>{formatDate(item.date)}</span>
                  </div>
                  <span className={`sf-badge sf-badge-${String(item.priority || "medium").toLowerCase()}`}>
                    {item.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}