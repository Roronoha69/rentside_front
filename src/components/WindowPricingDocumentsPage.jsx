import React from 'react';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';
import {
  uploadWindowPricingDocument,
  listWindowPricingDocuments,
  importWindowPricingDocument,
  activateWindowPricingDocument,
  deactivateWindowPricingDocument,
} from '../services/api';
import ImportReportModal from './ImportReportModal';
import '../styles/windowPricingDocuments.css';

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function statusPill(status) {
  const s = String(status || '').toLowerCase();
  const cls =
    s === 'active' ? 'wpd-pill wpd-pill-active' :
    s === 'imported' ? 'wpd-pill wpd-pill-imported' :
    s === 'error' ? 'wpd-pill wpd-pill-error' :
    'wpd-pill wpd-pill-uploaded';
  return <span className={cls}>{status || 'uploaded'}</span>;
}

export default function WindowPricingDocumentsPage() {
  const [dragOver, setDragOver] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [loadingList, setLoadingList] = React.useState(false);
  const [docs, setDocs] = React.useState([]);
  const [importingId, setImportingId] = React.useState(null);
  const [activatingId, setActivatingId] = React.useState(null);
  const [deactivatingId, setDeactivatingId] = React.useState(null);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [report, setReport] = React.useState(null);

  const fileInputRef = React.useRef(null);

  const refresh = React.useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await listWindowPricingDocuments();
      setDocs(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoadingList(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleUploadFile(file) {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are allowed');
      return;
    }
    setUploading(true);
    try {
      console.debug('[WindowPricingDocuments] upload start', { name: file.name, type: file.type, size: file.size });
      await uploadWindowPricingDocument(file);
      console.debug('[WindowPricingDocuments] upload done');
      toast.success('Uploaded');
      await refresh();
    } catch (e) {
      console.debug('[WindowPricingDocuments] upload error', e?.response?.data || e);
      toast.error(e?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function onImport(id) {
    setImportingId(id);
    try {
      console.debug('[WindowPricingDocuments] import start', { id });
      const res = await importWindowPricingDocument(id);
      const rep = res?.import_report || res?.data?.import_report || null;
      console.debug('[WindowPricingDocuments] import response', res);
      setReport(rep);
      setReportOpen(true);
      toast.success('Import finished');
      await refresh();
    } catch (e) {
      const rep = e?.response?.data?.import_report || null;
      console.debug('[WindowPricingDocuments] import error', e?.response?.data || e);
      setReport(rep);
      setReportOpen(true);
      toast.error(e?.response?.data?.message || 'Import failed');
      await refresh();
    } finally {
      setImportingId(null);
    }
  }

  async function onActivate(id) {
    setActivatingId(id);
    try {
      console.debug('[WindowPricingDocuments] activate start', { id });
      await activateWindowPricingDocument(id);
      console.debug('[WindowPricingDocuments] activate done', { id });
      toast.success('Activated');
      await refresh();
    } catch (e) {
      console.debug('[WindowPricingDocuments] activate error', e?.response?.data || e);
      toast.error(e?.response?.data?.message || 'Activation failed');
    } finally {
      setActivatingId(null);
    }
  }

  async function onDeactivate(id) {
    setDeactivatingId(id);
    try {
      console.debug('[WindowPricingDocuments] deactivate start', { id });
      await deactivateWindowPricingDocument(id);
      console.debug('[WindowPricingDocuments] deactivate done', { id });
      toast.success('Deactivated');
      await refresh();
    } catch (e) {
      console.debug('[WindowPricingDocuments] deactivate error', e?.response?.data || e);
      toast.error(e?.response?.data?.message || 'Deactivation failed');
    } finally {
      setDeactivatingId(null);
    }
  }

  return (
    <div className="search-page-layout">
      <Sidebar />
      <div className="search-content">
        <div className="wpd-header">
          <h1>Window Pricing Documents</h1>
          <button className="wpd-button wpd-button-secondary" onClick={refresh} disabled={loadingList}>
            {loadingList ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        <div
          className={`wpd-dropzone ${dragOver ? 'is-dragover' : ''} ${uploading ? 'is-disabled' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer?.files?.[0];
            handleUploadFile(f);
          }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div className="wpd-dropzone-title">Drag & drop a PDF here</div>
          <div className="wpd-muted">or click to select a file</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleUploadFile(e.target.files?.[0])}
            disabled={uploading}
          />
          {uploading && <div className="wpd-uploading">Uploading…</div>}
        </div>

        <div className="wpd-table-wrapper">
          <table className="wpd-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th>Version</th>
                <th style={{ width: 260 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="wpd-muted">No documents yet.</td>
                </tr>
              ) : (
                docs.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div className="wpd-filename">
                        <span>{d.filename || d.id}</span>
                        {Boolean(d.is_active) && <span className="wpd-active-badge">ACTIVE</span>}
                      </div>
                    </td>
                    <td>{formatDate(d.uploaded_at)}</td>
                    <td>{statusPill(d.status)}</td>
                    <td className="wpd-mono">{d.version || '-'}</td>
                    <td>
                      <div className="wpd-actions">
                        <button
                          className="wpd-button"
                          onClick={() => onImport(d.id)}
                          disabled={importingId === d.id || uploading || activatingId != null || deactivatingId != null}
                        >
                          {importingId === d.id ? 'Importing…' : 'Import'}
                        </button>
                        {Boolean(d.is_active) ? (
                          <button
                            className="wpd-button wpd-button-secondary"
                            onClick={() => onDeactivate(d.id)}
                            disabled={deactivatingId === d.id || uploading || importingId != null || activatingId != null}
                          >
                            {deactivatingId === d.id ? 'Deactivating…' : 'Deactivate'}
                          </button>
                        ) : (
                          <button
                            className="wpd-button wpd-button-primary"
                            onClick={() => onActivate(d.id)}
                            disabled={activatingId === d.id || uploading || importingId != null || deactivatingId != null}
                          >
                            {activatingId === d.id ? 'Activating…' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ImportReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          report={report}
        />
      </div>
    </div>
  );
}
