import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

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

const severityConfig = {
  Critical: { color: palette.danger, position: '92%' },
  High: { color: palette.danger, position: '75%' },
  Medium: { color: palette.warning, position: '50%' },
  Low: { color: palette.success, position: '20%' },
};

export default function AIAnalysisResults({ inspection }) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const data = inspection || {
    id: 'INS-101',
    location: 'Chennai Central',
    type: 'Bridge',
    severity: 'High',
    priority: 'High',
    date: '2026-08-18',
  };

  const severity = data.severity || 'High';
  const severityInfo = severityConfig[severity] || severityConfig.High;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .analysis-page {
          min-height: 100vh;
          background: ${palette.background};
          color: ${palette.text};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 32px 24px;
        }

        .analysis-shell {
          max-width: 1280px;
          margin: 0 auto;
        }

        .analysis-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 28px;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: ${palette.primary};
          font-size: 0.92rem;
          font-weight: 600;
          padding: 0;
          cursor: pointer;
          margin-bottom: 12px;
        }

        .back-button:hover {
          text-decoration: underline;
        }

        .analysis-title {
          margin: 0;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          line-height: 1.2;
          font-weight: 700;
        }

        .analysis-subtitle {
          margin: 8px 0 0;
          color: ${palette.muted};
          font-size: 0.95rem;
        }

        .inspection-id {
          background: ${palette.card};
          border: 1px solid rgba(17, 24, 39, 0.08);
          border-radius: 8px;
          padding: 9px 13px;
          color: ${palette.muted};
          font-size: 0.82rem;
          font-weight: 600;
        }

        .analysis-card {
          background: ${palette.card};
          border: 1px solid rgba(17, 24, 39, 0.06);
          border-radius: ${palette.radius}px;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 0;
        }

        .upload-panel {
          padding: 28px;
          border-right: 1px solid rgba(17, 24, 39, 0.06);
          display: flex;
          flex-direction: column;
        }

        .details-panel {
          padding: 28px;
        }

        .section-label {
          display: block;
          margin-bottom: 12px;
          color: ${palette.muted};
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .upload-dropzone {
          border: 2px dashed rgba(37, 99, 235, 0.3);
          background: rgba(37, 99, 235, 0.02);
          border-radius: ${palette.radius}px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .upload-dropzone:hover {
          border-color: ${palette.primary};
          background: rgba(37, 99, 235, 0.05);
        }

        .file-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .upload-icon {
          width: 48px;
          height: 48px;
          color: ${palette.primary};
          margin-bottom: 12px;
        }

        .upload-text {
          font-size: 1rem;
          font-weight: 600;
          color: ${palette.text};
          margin-bottom: 4px;
        }

        .upload-subtext {
          font-size: 0.82rem;
          color: ${palette.muted};
        }

        .selected-file-badge {
          margin-top: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          color: ${palette.primary};
          background: rgba(37, 99, 235, 0.1);
          padding: 6px 12px;
          border-radius: 6px;
        }

        .details-title {
          margin: 0 0 22px;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .info-item {
          border: 1px solid rgba(17, 24, 39, 0.06);
          border-radius: 9px;
          padding: 15px;
          background: #FFFFFF;
        }

        .info-label {
          display: block;
          color: ${palette.muted};
          font-size: 0.74rem;
          font-weight: 600;
          margin-bottom: 7px;
          text-transform: uppercase;
        }

        .info-value {
          color: ${palette.text};
          font-size: 0.98rem;
          font-weight: 700;
        }

        .meter-container {
          margin-top: 20px;
        }

        .meter-bar {
          position: relative;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, #059669 0%, #D97706 50%, #DC2626 100%);
          margin: 12px 0 8px;
        }

        .meter-pointer {
          position: absolute;
          top: -4px;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid ${palette.text};
        }

        .meter-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: ${palette.muted};
          font-weight: 600;
        }

        .issues-section {
          padding: 24px 28px;
          border-top: 1px solid rgba(17, 24, 39, 0.06);
        }

        .issues-title {
          margin: 0 0 12px;
          font-size: 1rem;
          font-weight: 700;
        }

        .issue-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .issue-tag {
          border: 1px solid rgba(220, 38, 38, 0.18);
          background: rgba(220, 38, 38, 0.06);
          color: ${palette.danger};
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        @media (max-width: 850px) {
          .analysis-grid { grid-template-columns: 1fr; }
          .upload-panel { border-right: none; border-bottom: 1px solid rgba(17, 24, 39, 0.06); }
        }
      `}</style>

      <main className="analysis-page">
        <div className="analysis-shell">
          <header className="analysis-header">
            <div>
              <button
                className="back-button"
                type="button"
                onClick={() => navigate("/dashboard")}
              >
                ← Continue to Dashboard
              </button>
              <h1 className="analysis-title">AI Analysis Results</h1>
              <p className="analysis-subtitle">
                Upload image or review automated structural inspection evaluation
              </p>
            </div>
            <div className="inspection-id">Inspection ID: {data.id}</div>
          </header>

          <section className="analysis-card">
            <div className="analysis-grid">
              
              {/* UPLOAD ZONE */}
              <div className="upload-panel">
                <span className="section-label">Upload Inspection Media</span>
                <div className="upload-dropzone">
                  <input
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <svg
                    className="upload-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="upload-text">Upload your image here</div>
                  <div className="upload-subtext">PNG, JPG or WEBP up to 10MB</div>
                  {selectedFile && (
                    <div className="selected-file-badge">
                      Selected: {selectedFile}
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILS PANEL */}
              <div className="details-panel">
                <h2 className="details-title">Analysis Summary</h2>

                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Infrastructure Type</span>
                    <span className="info-value">{data.type}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Damage Severity</span>
                    <span className="info-value" style={{ color: severityInfo.color }}>
                      {severity}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Confidence Score</span>
                    <span className="info-value">87%</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date</span>
                    <span className="info-value">{data.date}</span>
                  </div>
                </div>

                <div className="meter-container">
                  <span className="info-label">Damage Severity Scale</span>
                  <div className="meter-bar">
                    <div
                      className="meter-pointer"
                      style={{ left: severityInfo.position }}
                    />
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
              <h3 className="issues-title">Detected Issues</h3>
              <div className="issue-tags">
                <span className="issue-tag">• Cracks Detected</span>
                <span className="issue-tag">• Structural Vulnerability</span>
                <span className="issue-tag">• Edge Failure Risk</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}