import React from 'react';

const palette = {
  primary: '#2563EB',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  radius: 12,
};

const priorityStyles = {
  Critical: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    color: palette.danger,
    border: '1px solid rgba(220, 38, 38, 0.2)',
  },
  High: {
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
    color: palette.warning,
    border: '1px solid rgba(217, 119, 6, 0.2)',
  },
  Medium: {
    backgroundColor: 'rgba(217, 119, 6, 0.06)',
    color: '#B7791F',
    border: '1px solid rgba(217, 119, 6, 0.15)',
  },
  Low: {
    backgroundColor: 'rgba(5, 150, 105, 0.08)',
    color: palette.success,
    border: '1px solid rgba(5, 150, 105, 0.2)',
  },
};

// Fixed placeholder values from the dashboard mockup
const summaryCards = [
  {
    label: 'Critical',
    value: 12,
    color: palette.danger,
  },
  {
    label: 'High',
    value: 28,
    color: palette.warning,
  },
  {
    label: 'Medium',
    value: 35,
    color: '#B7791F',
  },
  {
    label: 'Low',
    value: 18,
    color: palette.success,
  },
];

// Hardcoded sample locations
const priorityLocations = [
  {
    location: 'Bridge - East Side',
    priority: 'Critical',
  },
  {
    location: 'Road - Riverside',
    priority: 'High',
  },
  {
    location: 'Building - Market Area',
    priority: 'High',
  },
  {
    location: 'Bridge - Old Town',
    priority: 'Medium',
  },
  {
    location: 'Road - Hill View',
    priority: 'Medium',
  },
];

function Dashboard() {
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .dashboard-page {
          min-height: 100vh;
          background: ${palette.background};
          color: ${palette.text};
          font-family: -apple-system, BlinkMacSystemFont,
            "Segoe UI", Roboto, sans-serif;
          padding: 28px 24px;
        }

        .dashboard-shell {
          max-width: 1360px;
          margin: 0 auto;
        }

        /* Header */

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .dashboard-title {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .dashboard-subtitle {
          margin: 5px 0 0;
          color: ${palette.muted};
          font-size: 0.88rem;
        }

        .authority {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 600;
        }

        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: ${palette.primary};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        /* Summary Cards */

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-card {
          position: relative;
          background: ${palette.card};
          border: 1px solid rgba(17, 24, 39, 0.06);
          border-radius: ${palette.radius}px;
          padding: 18px;
          min-height: 105px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .summary-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: var(--accent);
        }

        .summary-label {
          display: block;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 8px;
        }

        .summary-value {
          margin: 0;
          font-size: 1.9rem;
          font-weight: 700;
          line-height: 1;
        }

        .summary-detail {
          margin-top: 7px;
          color: ${palette.muted};
          font-size: 0.76rem;
        }

        /* Main Content */

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.55fr 0.85fr;
          gap: 18px;
        }

        .dashboard-card {
          background: ${palette.card};
          border: 1px solid rgba(17, 24, 39, 0.06);
          border-radius: ${palette.radius}px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .card-header {
          padding: 18px 20px 15px;
          border-bottom: 1px solid rgba(17, 24, 39, 0.06);
        }

        .card-title {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 700;
        }

        .card-subtitle {
          margin: 5px 0 0;
          color: ${palette.muted};
          font-size: 0.8rem;
        }

        /* Static Map */

        .map {
          position: relative;
          height: 360px;
          overflow: hidden;

          background:
            linear-gradient(
              135deg,
              #e4eee2 0%,
              #eef3e8 45%,
              #dcebe1 100%
            );
        }

        /* Water */

        .water {
          position: absolute;
          right: -30px;
          top: -20px;
          width: 38%;
          height: 120%;
          background: rgba(164, 207, 224, 0.55);
          border-radius: 50%;
          transform: rotate(8deg);
        }

        .water-small {
          position: absolute;
          left: 42%;
          bottom: -100px;
          width: 25%;
          height: 55%;
          background: rgba(164, 207, 224, 0.4);
          border-radius: 50%;
        }

        /* Static roads */

        .road {
          position: absolute;
          height: 5px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          box-shadow: 0 0 0 1px rgba(120, 130, 120, 0.1);
        }

        .road-1 {
          width: 90%;
          left: -5%;
          top: 45%;
          transform: rotate(-18deg);
        }

        .road-2 {
          width: 85%;
          left: 0;
          top: 65%;
          transform: rotate(8deg);
        }

        .road-3 {
          width: 75%;
          left: 15%;
          top: 30%;
          transform: rotate(34deg);
        }

        .road-4 {
          width: 65%;
          left: 10%;
          top: 75%;
          transform: rotate(-28deg);
        }

        .road-5 {
          width: 55%;
          left: 25%;
          top: 50%;
          transform: rotate(60deg);
        }

        /* Map Pins */

        .pin {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.18);
        }

        .pin::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          top: 6px;
          left: 6px;
        }

        .pin-critical {
          background: ${palette.danger};
        }

        .pin-high {
          background: ${palette.warning};
        }

        .pin-medium {
          background: #E3A928;
        }

        .pin-low {
          background: ${palette.success};
        }

        .pin-1 {
          left: 27%;
          top: 25%;
        }

        .pin-2 {
          left: 48%;
          top: 44%;
        }

        .pin-3 {
          left: 70%;
          top: 28%;
        }

        .pin-4 {
          left: 14%;
          top: 54%;
        }

        .pin-5 {
          left: 31%;
          top: 68%;
        }

        /* Map controls */

        .map-controls {
          position: absolute;
          right: 12px;
          bottom: 12px;
          background: white;
          border: 1px solid rgba(17, 24, 39, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        .map-control {
          display: block;
          width: 32px;
          height: 32px;
          border: none;
          background: white;
          font-size: 1.1rem;
          cursor: default;
        }

        .map-control + .map-control {
          border-top: 1px solid rgba(17, 24, 39, 0.08);
        }

        /* Priority List */

        .priority-list {
          padding: 4px 20px 10px;
        }

        .priority-item {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 58px;
          border-bottom: 1px solid rgba(17, 24, 39, 0.06);
        }

        .priority-item:last-child {
          border-bottom: none;
        }

        .rank {
          width: 22px;
          color: ${palette.muted};
          font-size: 0.8rem;
          font-weight: 600;
        }

        .location {
          flex: 1;
          min-width: 0;
          font-size: 0.84rem;
          font-weight: 600;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 5px 9px;
          font-size: 0.65rem;
          font-weight: 700;
          white-space: nowrap;
        }

        /* Responsive */

        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .dashboard-page {
            padding: 20px 14px;
          }

          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .authority {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .summary-grid {
            grid-template-columns: 1fr 1fr;
          }

          .summary-card {
            padding: 15px;
          }

          .map {
            height: 280px;
          }
        }
      `}</style>

      <div className="dashboard-page">
        <div className="dashboard-shell">

          {/* Header */}
          <header className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                Priority Dashboard
              </h1>

              <p className="dashboard-subtitle">
                Infrastructure damage priority overview
              </p>
            </div>

            <div className="authority">
              <span>Authority</span>

              <div className="avatar">
                A
              </div>
            </div>
          </header>

          {/* Summary Cards */}
          <section className="summary-grid">

            {summaryCards.map((card) => (
              <article
                key={card.label}
                className="summary-card"
                style={{
                  '--accent': card.color,
                }}
              >
                <span className="summary-label">
                  {card.label}
                </span>

                <p className="summary-value">
                  {card.value}
                </p>

                <div className="summary-detail">
                  Locations
                </div>
              </article>
            ))}

          </section>

          {/* Dashboard Content */}
          <section className="dashboard-grid">

            {/* Priority Map */}
            <article className="dashboard-card">

              <div className="card-header">
                <h2 className="card-title">
                  Priority Map
                </h2>

                <p className="card-subtitle">
                  Infrastructure locations by priority
                </p>
              </div>

              <div className="map">

                <div className="water" />
                <div className="water-small" />

                <div className="road road-1" />
                <div className="road road-2" />
                <div className="road road-3" />
                <div className="road road-4" />
                <div className="road road-5" />

                <div className="pin pin-critical pin-1" />
                <div className="pin pin-medium pin-2" />
                <div className="pin pin-low pin-3" />
                <div className="pin pin-critical pin-4" />
                <div className="pin pin-high pin-5" />

                <div className="map-controls">
                  <button
                    className="map-control"
                    type="button"
                  >
                    +
                  </button>

                  <button
                    className="map-control"
                    type="button"
                  >
                    −
                  </button>
                </div>

              </div>

            </article>

            {/* Top Priority Locations */}
            <article className="dashboard-card">

              <div className="card-header">
                <h2 className="card-title">
                  Top Priority Locations
                </h2>

                <p className="card-subtitle">
                  Highest priority infrastructure
                </p>
              </div>

              <div className="priority-list">

                {priorityLocations.map((item, index) => (
                  <div
                    className="priority-item"
                    key={item.location}
                  >
                    <span className="rank">
                      {index + 1}.
                    </span>

                    <span className="location">
                      {item.location}
                    </span>

                    <span
                      className="badge"
                      style={priorityStyles[item.priority]}
                    >
                      {item.priority}
                    </span>
                  </div>
                ))}

              </div>

            </article>

          </section>

        </div>
      </div>
    </>
  );
}

export default Dashboard;