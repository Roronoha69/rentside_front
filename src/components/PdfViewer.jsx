import React, { useState } from 'react';
import '../styles/pdfviewer.css';

const defaultFenetre = {
  type_fenetre: 'Battante',
  type_verre: 'Double',
  type_vitrage: 'Clair',
  dimensions: '1340 x 1260',
  materiaux: 'PVC',
  couleur: 'Blanc',
  type_ouverture: 'Intérieure',
  securite: 'Standard',
  volet: 'Non',
  vantaux: 2
};
const defaultGarage = {
  type_porte: 'Sectionnelle',
  dimensions: '2400 x 2340',
  motorisation: 'Oui',
  isolation: 'Oui',
  couleur: 'Blanc'
};

export default function PdfViewer({ page, variables }) {
  const [zoom, setZoom] = useState(1);
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.6));

  // Mock: utilise les variables par défaut si non fournies
  const data = page === 'fenetre' ? { ...defaultFenetre, ...(variables||{}) }
    : page === 'garage' ? { ...defaultGarage, ...(variables||{}) }
    : {};

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <button onClick={handleZoomOut} aria-label="Zoom out">-</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={handleZoomIn} aria-label="Zoom in">+</button>
      </div>
      <div className="pdf-canvas-wrapper" style={{ transform: `scale(${zoom})` }}>
        {page === 'fenetre' && (
          <div className="devis-html fenetre">
            <h2>Devis Fenêtre/Porte</h2>
            <div className="devis-section">
              <strong>Type de fenêtre :</strong> {data.type_fenetre}<br/>
              <strong>Type de verre :</strong> {data.type_verre}<br/>
              <strong>Type de vitrage :</strong> {data.type_vitrage}<br/>
              <strong>Dimensions :</strong> {data.dimensions}<br/>
              <strong>Matériaux :</strong> {data.materiaux}<br/>
              <strong>Couleur :</strong> {data.couleur}<br/>
              <strong>Type d’ouverture :</strong> {data.type_ouverture}<br/>
              <strong>Sécurité :</strong> {data.securite}<br/>
              <strong>Volet roulant intégré :</strong> {data.volet}<br/>
              <strong>Nombre de vantaux :</strong> {data.vantaux}
            </div>
            <div className="devis-section devis-img-mock fenetre"/>
          </div>
        )}
        {page === 'garage' && (
          <div className="devis-html garage">
            <h2>Devis Garage</h2>
            <div className="devis-section">
              <strong>Type de porte :</strong> {data.type_porte}<br/>
              <strong>Dimensions :</strong> {data.dimensions}<br/>
              <strong>Motorisation :</strong> {data.motorisation}<br/>
              <strong>Isolation :</strong> {data.isolation}<br/>
              <strong>Couleur :</strong> {data.couleur}
            </div>
            <div className="devis-section devis-img-mock garage"/>
          </div>
        )}
        {page === 'sol' && (
          <div className="devis-html sol">
            <h2>Devis Sol (à venir)</h2>
          </div>
        )}
      </div>
    </div>
  );
}
