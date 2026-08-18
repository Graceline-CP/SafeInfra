import React from 'react';
import { reports, dashboardStats } from '../data/mockData';

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
  inputRadius: 8,
};

const severityStyles = {
  Critical: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    color: palette.danger,
    border: '1px solid rgba(220, 38, 38, 0.2)',
  },
  High: {
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    color: palette.warning,
    border: '1px solid rgba(217, 119, 6, 0.2)',
  },
  Medium: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: palette.primary,
    border: '1px solid rgba(37, 99, 235, 0.2)',
  },
  Low: {
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    color: palette.success,
    border: '1px solid rgba(5, 150, 105, 0.2)',
  },
};

const priorityStyles = {
  Critical: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    color: palette.danger,
    border: '1px solid rgba(220, 38, 38, 0.2)',
  },
  High: {
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    color: palette.warning,
    border: '1px solid rgba(217, 119, 6, 0.2)',
  },
  Medium: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    color: palette.primary,
    border: '1px solid rgba(37, 99, 235, 0.2)',
  },
  Low: {
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    color: palette.success,
    border: '1px solid rgba(5, 150, 105, 0.2)',
  },
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1V10M8 10L5 7M8 10L11 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 13.5H13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Reports({ onViewAnalysis }) {
  const summaryCards = [
    {
      label: 'Total Inspections',
      value: summaryStats?.total || 24,
      detail: 'All infrastructure assessments',
      accent: palette.primary,
    },
    {
      label: 'Critical',
      value: summaryStats?.critical || 3,
      detail: 'Require immediate attention',
      accent: palette.danger,
    },
    {
      label: 'High',
      value: summaryStats?.high || 7,
      detail: 'Priority follow-up needed',
      accent: palette.warning,
    },
    {
      label: 'Medium',
      value: summaryStats?.medium || 10,
      detail: 'Scheduled assessment',
      accent: palette.primary,
    },
    {
      label: 'Low',
      value: summaryStats?.low || 4,
      detail: 'Routine monitoring',
      accent: palette.success,
    },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .reports-page {
          min-height: 100vh;
          background: ${palette.background};
          color: ${palette.text};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 32px 24px;
        }

        .reports-shell {
          max-width: 1360px;
          margin: 0 auto;
        }

        .reports-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .reports-title {
          margin: 0;
          font-size: clamp(1.9rem, 2.5vw, 2.7rem);
          line-height: 1.2;
          font-weight: 700;
          color: ${palette.text};
        }

        .reports-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ghost-button,
        .primary-button {
          border: none;
          border-radius: ${palette.inputRadius}px;
          padding: 10px 16px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .ghost-button {
          background: ${palette.card};
          color: ${palette.text};
          border: 1px solid rgba(17, 24, 39, 0.08);
        }

        .primary-button {
          background: ${palette.primary};
          color: #ffffff;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.18);
        }

        .ghost-button:hover,
        .primary-button:hover {
          transform: translateY(-1px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stats-card {
          background: ${palette.card};
          border: 1px solid rgba(17, 24, 39, 0.06);
          border-radius: ${palette.radius}px;
          padding: 20px 18px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.2s ease;
        }

        .stats-card:hover {
          box-shadow: 0 4px 8px rgba(15, 23, 42, 0.08);
        }

        .stats-card::before {
          content: '';
          position: absolute;
          inset: 0 auto 0 0;
          width: 4px;
          background: var(--accent);
        }

        .stats-label {
          display: block;
          font-size: 0.75rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: ${palette.muted};
          margin-bottom: 10px;
          font-weight: 600;
        }

        .stats-value {
          font-size: clamp(1.5rem, 2vw, 2rem);
          line-height: 1.2;
          font-weight: 700;
          margin: 0;
          color: ${palette.text};
        }

        .stats-detail {
          margin-top: 6px;
          color: ${palette.muted};
          font-size: 0.82rem;
        }

        .table-card {
          background: ${palette.card};
          border: 1px solid rgba(17, 24, 39, 0.06);
          border-radius: ${palette.radius}px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 22px 24px 16px;
          border-bottom: 1px solid rgba(17, 24, 39, 0.06);
        }

        .table-title {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: ${palette.text};
        }

        .table-subtitle {
          margin: 6px 0 0;
          color: ${palette.muted};
          font-size: 0.92rem;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          background: rgba(37, 99, 235, 0.08);
          color: ${palette.primary};
        }

        .reports-table-wrap {
          overflow-x: auto;
        }

        .reports-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }

        .reports-table thead th {
          background: rgba(249, 250, 251, 0.8);
          color: ${palette.muted};
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-align: left;
          padding: 14px 24px;
          border-bottom: 1px solid rgba(17, 24, 39, 0.06);
        }

        .reports-table tbody td {
          padding: 16px 24px;
          border-bottom: 1px solid rgba(17, 24, 39, 0.06);
          color: ${palette.text};
          font-size: 0.95rem;
          vertical-align: middle;
        }

        .reports-table tbody tr {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .reports-table tbody tr:hover {
          background: rgba(37, 99, 235, 0.03);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .action-button {
          background: none;
          border: none;
          color: ${palette.primary};
          cursor: pointer;
          padding: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: background-color 0.15s ease;
        }

        .action-button:hover {
          background-color: rgba(37, 99, 235, 0.1);
        }

        .action-button svg {
          stroke: currentColor;
          stroke-width: 1.5;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(3, minmax(160px, 1fr));
            gap: 14px;
          }
        }

        @media (max-width: 768px) {
          .reports-page { padding: 20px 14px; }
          .reports-header { flex-direction: column; align-items: flex-start; }
          .stats-grid { grid-template-columns: repeat(2, minmax(140px, 1fr)); gap: 12px; }
          .stats-card { padding: 16px 14px; }
          .stats-label { font-size: 0.7rem; margin-bottom: 8px; }
          .stats-value { font-size: clamp(1.3rem, 1.8vw, 1.6rem); }
          .table-header { flex-direction: column; align-items: flex-start; padding: 16px 16px 12px; }
          .reports-table thead th, .reports-table tbody td { padding-left: 16px; padding-right: 16px; }
        }

        @media (max-width: 640px) {
          .reports-page { padding: 16px 12px; }
          .stats-grid { grid-template-columns: 1fr; }
          .reports-table { min-width: 640px; }
        }
      `}</style>

      <div className="reports-page">
        <div className="reports-shell">
          <header className="reports-header">
            <div>
              <h1 className="reports-title">Reports</h1>
            </div>

            <div className="reports-actions">
              <button className="ghost-button" type="button">
                Export
              </button>
              <button className="primary-button" type="button">
                New report
              </button>
            </div>
          </header>

          <section className="stats-grid" aria-label="Inspection summary statistics">
            {summaryCards.map((card) => (
              <article key={card.label} className="stats-card" style={{ '--accent': card.accent }}>
                <span className="stats-label">{card.label}</span>
                <p className="stats-value">{card.value}</p>
                <div className="stats-detail">{card.detail}</div>
              </article>
            ))}
          </section>

          <section className="table-card" aria-label="Inspection report list">
            <div className="table-header">
              <div>
                <h2 className="table-title">Inspection Records</h2>
                <p className="table-subtitle">SafeInfra Infrastructure Assessment Database</p>
              </div>
              <span className="status-pill">Active</span>
            </div>

            <div className="reports-table-wrap">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Priority</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.slice(0, 20).map((item) => (
                    <tr key={item.id} onClick={() => onViewAnalysis && onViewAnalysis(item)}>
                      <td>{item.id}</td>
                      <td>{item.location}</td>
                      <td>{item.type}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={severityStyles[item.severity] || {
                            backgroundColor: 'rgba(107, 114, 128, 0.08)',
                            color: palette.muted,
                            border: '1px solid rgba(107, 114, 128, 0.2)',
                          }}
                        >
                          {item.severity}
                        </span>
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={priorityStyles[item.priority] || {
                            backgroundColor: 'rgba(107, 114, 128, 0.08)',
                            color: palette.muted,
                            border: '1px solid rgba(107, 114, 128, 0.2)',
                          }}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td>{formatDate(item.date)}</td>
                      <td>
                        <button
                          className="action-button"
                          type="button"
                          title="Download report"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Downloading report for ${item.id}...`);
                          }}
                        >
                          <DownloadIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Reports;