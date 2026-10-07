import { useState } from 'react';
import { useReports } from "../components/useReports";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const palette = {
  primary: '#06B6D4',
  success: '#16A34A',
  warning: '#F97316',
  danger: '#DC2626',
  medium: '#EAB308',
  background: '#F1F5F9',
  card: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  graphite: '#111827',
  radius: 8,
  inputRadius: 8,
};

const severityStyles = {
  Critical: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    color: '#B91C1C',
    '--status-color': palette.danger,
    border: '1px solid rgba(220, 38, 38, 0.2)',
  },
  High: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    color: '#C2410C',
    '--status-color': palette.warning,
    border: '1px solid rgba(249, 115, 22, 0.22)',
  },
  Medium: {
    backgroundColor: 'rgba(234, 179, 8, 0.14)',
    color: '#854D0E',
    '--status-color': palette.medium,
    border: '1px solid rgba(234, 179, 8, 0.28)',
  },
  Low: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    color: '#15803D',
    '--status-color': palette.success,
    border: '1px solid rgba(22, 163, 74, 0.22)',
  },
};

const priorityStyles = {
  Critical: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    color: '#B91C1C',
    '--status-color': palette.danger,
    border: '1px solid rgba(220, 38, 38, 0.2)',
  },
  High: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    color: '#C2410C',
    '--status-color': palette.warning,
    border: '1px solid rgba(249, 115, 22, 0.22)',
  },
  Medium: {
    backgroundColor: 'rgba(234, 179, 8, 0.14)',
    color: '#854D0E',
    '--status-color': palette.medium,
    border: '1px solid rgba(234, 179, 8, 0.28)',
  },
  Low: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    color: '#15803D',
    '--status-color': palette.success,
    border: '1px solid rgba(22, 163, 74, 0.22)',
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
  const { reports, stats: dashboardStats, loading } = useReports();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredReports = reports.filter((report) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [
      report.id,
      report.location,
      report.type,
      report.severity,
      report.priority,
    ].some((value) => String(value || '').toLowerCase().includes(query));

    return matchesSearch && (severityFilter === 'All' || report.severity === severityFilter);
  });
  const pageCount = Math.max(1, Math.ceil(filteredReports.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleReports = filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SAFEINFRA", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Infrastructure Safety Intelligence - Inspection Reports", 14, 27);

    autoTable(doc, {
      startY: 34,
      head: [["ID", "Location", "Type", "Severity", "Priority", "Date"]],
      body: reports.map((r) => [
        r.id,
        r.location,
        r.type,
        r.severity,
        r.priority,
        formatDate(r.date),
      ]),
      headStyles: { fillColor: [17, 24, 39] },
      styles: { fontSize: 9 },
    });

    doc.save("safeinfra_reports.pdf");
  };
    const handleDownloadReport = (report) => {
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("SAFEINFRA", 20, 25);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Infrastructure Safety Intelligence", 20, 32);

      doc.line(20, 38, 190, 38);

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("INSPECTION REPORT", 20, 55);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      doc.text(`Report ID: ${report.id}`, 20, 68);
      doc.text(`Location: ${report.location}`, 20, 80);
      doc.text(`Type: ${report.type}`, 20, 92);
      doc.text(`Severity: ${report.severity}`, 20, 104);
      doc.text(`Priority: ${report.priority}`, 20, 116);
      doc.text(`Inspection Date: ${formatDate(report.date)}`, 20, 128);

      doc.line(20, 140, 190, 140);

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("AI Assessment", 20, 155);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "This report contains the infrastructure safety assessment",
        20,
        168
      );
      doc.text(
        "recorded by the SafeInfra inspection system.",
        20,
        177
      );

      doc.line(20, 260, 190, 260);

      doc.setFontSize(9);
      doc.text("Safe infrastructure. Smarter decisions.", 20, 272);
      doc.text("SAFEINFRA", 160, 272);

      doc.save(`safeinfra_report_${report.id}.pdf`);
    };
  
  const summaryCards = [
    {
      label: 'Total Inspections',
      value: reports.length,
      detail: 'All infrastructure assessments',
      accent: palette.primary,
    },
    {
      label: 'Critical',
      value: dashboardStats.critical,
      detail: 'Require immediate attention',
      accent: palette.danger,
    },
    {
      label: 'High',
      value: dashboardStats.high,
      detail: 'Priority follow-up needed',
      accent: palette.warning,
    },
    {
      label: 'Medium',
      value: dashboardStats.medium,
      detail: 'Scheduled assessment',
      accent: palette.medium,
    },
    {
      label: 'Low',
      value: dashboardStats.low,
      detail: 'Routine monitoring',
      accent: palette.success,
    },
  ];

  return (
    <>
      <style>{`
        .reports-page, .reports-page * { box-sizing: border-box; }

        .reports-page {
          min-height: 100vh;
          background: ${palette.background};
          color: ${palette.text};
          font-family: var(--sf-font-sans);
          padding: 32px 40px 48px;
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
          font-size: 30px;
          line-height: 1.2;
          font-weight: 600;
          color: ${palette.text};
        }

        .reports-description {
          margin: 8px 0 0;
          color: ${palette.muted};
          font-size: 14px;
          line-height: 1.5;
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
          color: ${palette.graphite};
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2);
        }

        .ghost-button:hover,
        .primary-button:hover {
          transform: translateY(-1px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stats-card {
          background: ${palette.card};
          border: 1px solid ${palette.border};
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
          border: 1px solid ${palette.border};
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
          border-bottom: 1px solid ${palette.border};
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
          background: #CFFAFE;
          color: #155E75;
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
          border-bottom: 1px solid ${palette.border};
        }

        .reports-table tbody td {
          padding: 16px 24px;
          border-bottom: 1px solid ${palette.border};
          color: ${palette.text};
          font-size: 0.95rem;
          vertical-align: middle;
        }

        .reports-table tbody tr {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .reports-table tbody tr:hover {
          background: #F0FDFA;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .status-badge::before {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;
          border-radius: 50%;
          background: var(--status-color, currentColor);
          content: '';
        }

        .report-id-cell {
          max-width: 150px;
          overflow: hidden;
          color: #334155 !important;
          font-variant-numeric: tabular-nums;
          text-overflow: ellipsis;
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
          background-color: rgba(6, 182, 212, 0.12);
        }

        .action-button svg {
          stroke: currentColor;
          stroke-width: 1.5;
        }

        .reports-toolbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin: 0 0 16px;
        }

        .reports-search-wrap {
          flex: 1;
          max-width: 440px;
        }

        .reports-filter-wrap {
          width: 190px;
        }

        .reports-control-label {
          display: block;
          margin-bottom: 6px;
          color: ${palette.muted};
          font-size: 12px;
          font-weight: 600;
        }

        .reports-search,
        .reports-filter {
          width: 100%;
          min-height: 42px;
          padding: 9px 12px;
          border: 1px solid ${palette.border};
          border-radius: 8px;
          background: ${palette.card};
          color: ${palette.text};
          font: inherit;
          font-size: 14px;
        }

        .reports-search:focus,
        .reports-filter:focus {
          border-color: ${palette.primary};
          outline: 3px solid rgba(6, 182, 212, 0.2);
          outline-offset: 1px;
        }

        .reports-count {
          align-self: center;
          color: ${palette.muted};
          font-size: 12px;
          white-space: nowrap;
        }

        .reports-table td:last-child,
        .reports-table th:last-child {
          width: 72px;
          text-align: center;
        }

        .table-state {
          padding: 48px 20px;
          color: ${palette.muted};
          text-align: center;
          font-size: 14px;
        }

        .table-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 20px;
          border-top: 1px solid ${palette.border};
          color: ${palette.muted};
          font-size: 12px;
        }

        .pagination-actions {
          display: flex;
          gap: 8px;
        }

        .pagination-button {
          min-width: 72px;
          min-height: 36px;
          padding: 7px 11px;
          border: 1px solid ${palette.border};
          border-radius: 7px;
          background: ${palette.card};
          color: ${palette.text};
          font: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .pagination-button:hover:not(:disabled) {
          border-color: ${palette.primary};
          background: #ECFEFF;
        }

        .pagination-button:disabled {
          color: #94A3B8;
          cursor: not-allowed;
        }

        @media (max-width: 1024px) {
          .reports-page { padding: 28px 24px 40px; }
          .stats-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
          }
        }

        @media (max-width: 768px) {
          .reports-page { padding: 20px 14px; }
          .reports-header { flex-direction: column; align-items: flex-start; }
          .reports-toolbar { align-items: stretch; flex-direction: column; }
          .reports-search-wrap, .reports-filter-wrap { width: 100%; max-width: none; }
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
          .stats-card { padding: 16px 14px; }
          .stats-label { font-size: 0.7rem; margin-bottom: 8px; }
          .stats-value { font-size: clamp(1.3rem, 1.8vw, 1.6rem); }
          .table-header { flex-direction: column; align-items: flex-start; padding: 16px 16px 12px; }
          .reports-table thead th, .reports-table tbody td { padding-left: 16px; padding-right: 16px; }
          .table-pagination { align-items: flex-start; flex-direction: column; padding: 14px 16px; }
        }

        @media (max-width: 640px) {
          .reports-page { padding: 16px 12px; }
          .stats-grid { grid-template-columns: 1fr; }
          .reports-table { min-width: 760px; }
          .stats-card { min-height: 125px; }
        }
      `}</style>

      <div className="reports-page">
        <div className="reports-shell">
          <header className="reports-header">
            <div>
              <h1 className="reports-title">Reports</h1>
              <p className="reports-description">
                Review and export infrastructure inspection records.
              </p>
            </div>

            <div className="reports-actions">
              <button
                className="ghost-button"
                type="button"
                onClick={handleExport}
              >
                Export
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={() => navigate("/upload")}
              >
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

          <div className="reports-toolbar" role="search">
            <div className="reports-search-wrap">
              <label className="reports-control-label" htmlFor="reports-search">
                Search reports
              </label>
              <input
                id="reports-search"
                className="reports-search"
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search ID, location, type, severity..."
              />
            </div>
            <div className="reports-filter-wrap">
              <label className="reports-control-label" htmlFor="reports-severity">
                Severity
              </label>
              <select
                id="reports-severity"
                className="reports-filter"
                value={severityFilter}
                onChange={(event) => {
                  setSeverityFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option>All</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <span className="reports-count" aria-live="polite">
              {filteredReports.length} of {reports.length} reports
            </span>
          </div>

          <section className="table-card" aria-label="Inspection report list">
            <div className="table-header">
              <div>
                <h2 className="table-title">Inspection Records</h2>
                <p className="table-subtitle">SafeInfra Infrastructure Assessment Database</p>
              </div>
              <span className="status-pill">{reports.length} records</span>
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
                  {loading ? (
                    <tr><td className="table-state" colSpan="7" role="status">Loading reports...</td></tr>
                  ) : visibleReports.length === 0 ? (
                    <tr>
                      <td className="table-state" colSpan="7">
                        {reports.length === 0 ? "No reports have been submitted yet." : "No reports match these filters."}
                      </td>
                    </tr>
                  ) : visibleReports.map((item) => (
                    <tr key={item.id} onClick={() => onViewAnalysis && onViewAnalysis(item)}>
                      <td className="report-id-cell">{item.id}</td>
                      <td>{item.location}</td>
                      <td>{item.type}</td>
                      <td>
                        <span className="status-badge" style={severityStyles[item.severity] || { backgroundColor: '#F1F5F9', color: palette.muted, border: `1px solid ${palette.border}` }}>
                          {item.severity || "Unknown"}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge" style={priorityStyles[item.priority] || { backgroundColor: '#F1F5F9', color: palette.muted, border: `1px solid ${palette.border}` }}>
                          {item.priority || "Unknown"}
                        </span>
                      </td>
                      <td>{formatDate(item.date)}</td>
                      <td>
                        <button
                          className="action-button"
                          type="button"
                          aria-label={`Download report ${item.id}`}
                          title="Download report"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDownloadReport(item);
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
            <div className="table-pagination">
              <span>Page {currentPage} of {pageCount}</span>
              <div className="pagination-actions">
                <button
                  className="pagination-button"
                  type="button"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </button>
                <button
                  className="pagination-button"
                  type="button"
                  disabled={currentPage >= pageCount || loading}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Reports;