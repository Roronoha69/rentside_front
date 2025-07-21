import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PdfViewer from './components/PdfViewer';
import RightPanel from './components/RightPanel';
import './styles/app.css';

function Layout({ page }) {
  const [variables, setVariables] = React.useState(undefined);
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <PdfViewer page={page} variables={variables} />
      </main>
      <RightPanel page={page} onVariablesChange={setVariables} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/devis-fenetre" replace />} />
        <Route path="/devis-fenetre" element={<Layout page="fenetre" />} />
        <Route path="/devis-sol" element={<Layout page="sol" />} />
        <Route path="/devis-garage" element={<Layout page="garage" />} />
      </Routes>
    </Router>
  );
}
