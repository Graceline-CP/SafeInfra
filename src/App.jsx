import React, { useState } from 'react';

// --- MOCK DATA ---
const initialInspections = [
  {
    id: "INS-101",
    location: "Chennai Central Flyover",
    type: "Bridge",
    severity: "High",
    priority: "High",
    date: "2026-08-18",
  },
  {
    id: "INS-102",
    location: "Anna Salai Metro Station",
    type: "Building",
    severity: "Critical",
    priority: "Critical",
    date: "2026-08-17",
  },
  {
    id: "INS-103",
    location: "Guindy Industrial Area",
    type: "Bridge",
    severity: "Medium",
    priority: "Medium",
    date: "2026-08-16",
  },
  {
    id: "INS-104",
    location: "T. Nagar Substation",
    type: "Building",
    severity: "Low",
    priority: "Low",
    date: "2026-08-15",
  },
];

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

const badgeStyles = {
  Critical: { backgroundColor: 'rgba(220, 38, 38, 0.1)', color: palette.danger, border: '1px solid rgba(220, 38, 38, 0.2)' },
  High: { backgroundColor: 'rgba(217, 119, 6, 0.1)', color: palette.warning, border: '1px solid rgba(217, 119, 6, 0.2)' },
  Medium: { backgroundColor: 'rgba(37, 99, 235, 0.1)', color: palette.primary, border: '1px solid rgba(37, 99, 235, 0.2)' },
  Low: { backgroundColor: 'rgba(5, 150, 105, 0.1)', color: palette.success, border: '1px solid rgba(5, 150, 105, 0.2)' },
};

const severityConfig = {
  Critical: { color: palette.danger, position: '92%' },
  High: { color: palette.danger, position: '75%' },
  Medium: { color: palette.warning, position: '50%' },
  Low: { color: palette.success, position: '20%' },
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// --- 1. AI ANALYZER VIEW (FIRST SCREEN) ---

function AIAnalysisResults({ inspection, onNavigateToReports }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const data = inspection || {
    id: "INS-105",
    location: "New Upload Site",
    type: "Bridge",
    severity: "High",
    priority: "High",
    date: "2026-08-18",
  };

  const severityInfo = severityConfig[data.severity] || severityConfig.High;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  return (
    <main className="analysis-page">
      <div className="analysis-shell">
        <header className="analysis-header">
          <div>
            <h1 className="analysis-title">AI Infrastructure Analyzer</h1>
            <p className="analysis-subtitle">
              Step 1: Upload inspection media to generate automated damage evaluation
            </p>
          </div>
          <button className="primary-button" type="button" onClick={onNavigateToReports}>
            Go to Reports Dashboard →
          </button>
        </header>

        <section className="analysis-card">
          <div className="analysis-grid">
            <div className="upload-panel">
              <span className="section-label">Upload Image for Analysis</span>
              <div className="upload-dropzone">
                <input
                  type="file"
                  className="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <svg className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="upload-text">Click or drag image here</div>
                <div className="upload-subtext">PNG, JPG or WEBP up to 10MB</div>
                {selectedFile && (
                  <div className="selected-file-badge">Loaded: {selectedFile}</div>
                )}
              </div>
            </div>

            <div className="details-panel">
              <h2 className="details-title">AI Diagnostic Output</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Structure Type</span>
                  <span className="info-value">{data.type}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Severity Level</span>
                  <span className="info-value" style={{ color: severityInfo.color }}>
                    {data.severity}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">AI Confidence</span>
                  <span className="info-value">89%</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Inspection Date</span>
                  <span className="info-value">{data.date}</span>
                </div>
              </div>

              <div className="meter-container">
                <span className="info-label">Damage Severity Scale</span>
                <div className="meter-bar">
                  <div className="meter-pointer" style={{ left: severityInfo.position }} />
                </div>
                <div className="meter-labels">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </div>

          <div className="issues-section">
            <h3 className="issues-title">Detected Defects</h3>
            <div className="issue-tags">
              <span className="issue-tag">• Structural Cracks Detected</span>
              <span className="issue-tag">• Concrete Spalling</span>
              <span className="issue-tag">• High Failure Risk</span>
            </div>
          </div>
        </section>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button className="primary-button" type="button" onClick={onNavigateToReports}>
            Save & View in Reports →
          </button>
        </div>
      </div>
    </main>
  );
}

// --- 2. REPORTS VIEW (SECOND SCREEN) ---

function Reports({ onSelectRecord, onNewAnalysis }) {
  const summaryCards = [
    { label: 'Total Inspections', value: initialInspections.length, detail: 'All logged assessments', accent: palette.primary },
    { label: 'Critical', value: 1, detail: 'Require immediate attention', accent: palette.danger },
    { label: 'High', value: 1, detail: 'Priority follow-up needed', accent: palette.warning },
    { label: 'Medium', value: 1, detail: 'Scheduled assessment', accent: palette.primary },
    { label: 'Low', value: 1, detail: 'Routine monitoring', accent: palette.success },
  ];

  return (
    <div className="reports-page">
      <div className="reports-shell">
        <header className="reports-header">
          <div>
            <h1 className="reports-title">Inspection Reports</h1>
            <p className="analysis-subtitle">Step 2: Summary dashboard of all processed assessments</p>
          </div>
          <div className="reports-actions">
            <button className="primary-button" type="button" onClick={onNewAnalysis}>
              + Run New AI Analysis
            </button>
          </div>
        </header>

        <section className="stats-grid">
          {summaryCards.map((card) => (
            <article key={card.label} className="stats-card" style={{ '--accent': card.accent }}>
              <span className="stats-label">{card.label}</span>
              <p className="stats-value">{card.value}</p>
              <div className="stats-detail">{card.detail}</div>
            </article>
          ))}
        </section>

        <section className="table-card">
          <div className="table-header">
            <div>
              <h2 className="table-title">All Inspection Records</h2>
              <p className="table-subtitle">Select any report row to re-open analysis</p>
            </div>
            <span className="status-pill">Active Database</span>
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
                {initialInspections.map((item) => (
                  <tr key={item.id} onClick={() => onSelectRecord(item)}>
                    <td><strong>{item.id}</strong></td>
                    <td>{item.location}</td>
                    <td>{item.type}</td>
                    <td>
                      <span className="status-badge" style={badgeStyles[item.severity]}>
                        {item.severity}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge" style={badgeStyles[item.priority]}>
                        {item.priority}
                      </span>
                    </td>
                    <td>{formatDate(item.date)}</td>
                    <td>
                      <button className="action-button" type="button">
                        View Analysis
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
  );
}

// --- MAIN APP CONTROLLER ---

export default function App() {
  // SET DEFAULT VIEW TO 'analyzer'
  const [currentView, setCurrentView] = useState('analyzer');
  const [selectedInspection, setSelectedInspection] = useState(null);

  const handleOpenReportRecord = (inspection) => {
    setSelectedInspection(inspection);
    setCurrentView('analyzer');
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: ${palette.background}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        
        .reports-page, .analysis-page { min-height: 100vh; padding: 32px 24px; color: ${palette.text}; }
        .reports-shell, .analysis-shell { max-width: 1360px; margin: 0 auto; }
        
        .reports-header, .analysis-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .reports-title, .analysis-title { margin: 0; font-size: 2rem; font-weight: 700; }
        .analysis-subtitle { margin: 4px 0 0; color: ${palette.muted}; font-size: 0.9rem; }
        .reports-actions { display: flex; gap: 12px; }
        
        .ghost-button, .primary-button { border: none; border-radius: ${palette.inputRadius}px; padding: 10px 18px; font-weight: 600; cursor: pointer; }
        .ghost-button { background: ${palette.card}; border: 1px solid rgba(17, 24, 39, 0.1); }
        .primary-button { background: ${palette.primary}; color: #fff; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
        .stats-card { background: ${palette.card}; border: 1px solid rgba(17, 24, 39, 0.06); border-radius: ${palette.radius}px; padding: 20px; position: relative; overflow: hidden; }
        .stats-card::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 4px; background: var(--accent); }
        .stats-label { font-size: 0.75rem; text-transform: uppercase; color: ${palette.muted}; font-weight: 600; }
        .stats-value { font-size: 1.8rem; font-weight: 700; margin: 8px 0 4px; }
        .stats-detail { font-size: 0.8rem; color: ${palette.muted}; }
        
        .table-card, .analysis-card { background: ${palette.card}; border: 1px solid rgba(17, 24, 39, 0.06); border-radius: ${palette.radius}px; overflow: hidden; }
        .table-header { padding: 20px 24px; border-bottom: 1px solid rgba(17, 24, 39, 0.06); display: flex; justify-content: space-between; align-items: center; }
        .table-title { margin: 0; font-size: 1.2rem; }
        .table-subtitle { margin: 4px 0 0; color: ${palette.muted}; font-size: 0.85rem; }
        .status-pill { background: rgba(37, 99, 235, 0.1); color: ${palette.primary}; padding: 6px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
        
        .reports-table { width: 100%; border-collapse: collapse; text-align: left; }
        .reports-table th { background: rgba(249, 250, 251, 0.8); color: ${palette.muted}; font-size: 0.75rem; text-transform: uppercase; padding: 14px 24px; border-bottom: 1px solid rgba(17, 24, 39, 0.06); }
        .reports-table td { padding: 16px 24px; border-bottom: 1px solid rgba(17, 24, 39, 0.06); }
        .reports-table tr { cursor: pointer; transition: background 0.15s; }
        .reports-table tr:hover { background: rgba(37, 99, 235, 0.04); }
        
        .status-badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
        .action-button { background: rgba(37, 99, 235, 0.1); color: ${palette.primary}; border: none; border-radius: 6px; padding: 6px 12px; font-weight: 600; cursor: pointer; }
        
        .analysis-grid { display: grid; grid-template-columns: 1fr 1fr; }
        .upload-panel { padding: 28px; border-right: 1px solid rgba(17, 24, 39, 0.06); }
        .details-panel { padding: 28px; }
        .section-label { display: block; margin-bottom: 12px; color: ${palette.muted}; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        
        .upload-dropzone { border: 2px dashed rgba(37, 99, 235, 0.3); background: rgba(37, 99, 235, 0.02); border-radius: ${palette.radius}px; padding: 40px; text-align: center; position: relative; }
        .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .upload-icon { width: 40px; height: 40px; color: ${palette.primary}; margin-bottom: 8px; }
        .upload-text { font-weight: 600; }
        .upload-subtext { font-size: 0.8rem; color: ${palette.muted}; }
        .selected-file-badge { margin-top: 12px; color: ${palette.primary}; font-weight: 600; font-size: 0.85rem; }
        
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
        .info-item { border: 1px solid rgba(17, 24, 39, 0.06); border-radius: 8px; padding: 12px; }
        .info-label { display: block; color: ${palette.muted}; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
        .info-value { font-weight: 700; font-size: 1rem; margin-top: 4px; display: block; }
        
        .meter-container { margin-top: 24px; }
        .meter-bar { position: relative; height: 8px; border-radius: 999px; background: linear-gradient(90deg, #059669 0%, #D97706 50%, #DC2626 100%); margin: 12px 0 8px; }
        .meter-pointer { position: absolute; top: -4px; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${palette.text}; }
        .meter-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: ${palette.muted}; font-weight: 600; }
        
        .issues-section { padding: 20px 28px; border-top: 1px solid rgba(17, 24, 39, 0.06); }
        .issues-title { margin: 0 0 12px; font-size: 1rem; }
        .issue-tags { display: flex; gap: 10px; }
        .issue-tag { background: rgba(220, 38, 38, 0.06); color: ${palette.danger}; border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 6px; padding: 6px 12px; font-size: 0.8rem; font-weight: 600; }
      `}</style>

      {currentView === 'analyzer' && (
        <AIAnalysisResults
          inspection={selectedInspection}
          onNavigateToReports={() => setCurrentView('reports')}
        />
      )}

      {currentView === 'reports' && (
        <Reports
          onSelectRecord={handleOpenReportRecord}
          onNewAnalysis={() => {
            setSelectedInspection(null);
            setCurrentView('analyzer');
          }}
        />
      )}
    </>
  );
}