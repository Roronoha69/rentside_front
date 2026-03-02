import React from 'react';
import '../styles/windowPricingDocuments.css';

export default function ImportReportModal({ open, onClose, report }) {
  if (!open) return null;

  const errors = Array.isArray(report?.errors) ? report.errors : [];

  return (
    <div className="wpd-modal-overlay" role="dialog" aria-modal="true">
      <div className="wpd-modal">
        <div className="wpd-modal-header">
          <h2>Import report</h2>
          <button className="wpd-button wpd-button-secondary" onClick={onClose}>Close</button>
        </div>

        {!report ? (
          <div className="wpd-muted">No report.</div>
        ) : (
          <div className="wpd-report-grid">
            <div><span className="wpd-label">Total rows</span><div>{report.total_rows ?? '-'}</div></div>
            <div><span className="wpd-label">Min width</span><div>{report.min_width ?? '-'}</div></div>
            <div><span className="wpd-label">Max width</span><div>{report.max_width ?? '-'}</div></div>
            <div><span className="wpd-label">Min height</span><div>{report.min_height ?? '-'}</div></div>
            <div><span className="wpd-label">Max height</span><div>{report.max_height ?? '-'}</div></div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="wpd-errors">
            <div className="wpd-label">Errors</div>
            <ul>
              {errors.map((e, idx) => <li key={idx}>{e}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

