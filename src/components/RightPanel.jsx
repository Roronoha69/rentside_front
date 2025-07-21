import React, { useState } from 'react';
import '../styles/rightpanel.css';
import '../styles/rightpanel.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const fenetreQuestions = [
  { label: 'Type de fenêtre', name: 'type_fenetre', type: 'select', options: ['Battante', 'Coulissante', 'Oscillo-battante', 'Fixe'] },
  { label: 'Type de verre', name: 'type_verre', type: 'select', options: ['Simple', 'Double', 'Triple'] },
  { label: 'Type de vitrage', name: 'type_vitrage', type: 'select', options: ['Clair', 'Opaque', 'Sablé', 'Dépoli'] },
  { label: 'Dimensions (L x H en cm)', name: 'dimensions', type: 'text' },
  { label: 'Matériaux', name: 'materiaux', type: 'select', options: ['PVC', 'Bois', 'Aluminium', 'Mixte'] },
  { label: 'Couleur', name: 'couleur', type: 'text' },
  { label: 'Type d’ouverture', name: 'type_ouverture', type: 'select', options: ['Intérieure', 'Extérieure'] },
  { label: 'Système de sécurité', name: 'securite', type: 'select', options: ['Standard', 'Renforcé', 'Anti-effraction'] },
  { label: 'Volet roulant intégré', name: 'volet', type: 'select', options: ['Oui', 'Non'] },
  { label: 'Nombre de vantaux', name: 'vantaux', type: 'number' }
];

const solQuestions = [
  { label: 'Type de sol', name: 'type_sol', type: 'select', options: ['Carrelage', 'Parquet', 'Moquette', 'Vinyle'] },
  { label: 'Surface (m²)', name: 'surface', type: 'number' },
  { label: 'Couleur', name: 'couleur', type: 'text' },
  { label: 'Finition', name: 'finition', type: 'select', options: ['Mat', 'Brillant', 'Satiné'] },
  { label: 'Plinthes incluses', name: 'plinthes', type: 'select', options: ['Oui', 'Non'] }
];

const garageQuestions = [
  { label: 'Type de porte', name: 'type_porte', type: 'select', options: ['Sectionnelle', 'Basculante', 'Enroulable', 'Battante'] },
  { label: 'Dimensions (L x H en cm)', name: 'dimensions', type: 'text' },
  { label: 'Motorisation', name: 'motorisation', type: 'select', options: ['Oui', 'Non'] },
  { label: 'Isolation', name: 'isolation', type: 'select', options: ['Oui', 'Non'] },
  { label: 'Couleur', name: 'couleur', type: 'text' }
];

const questionSets = {
  fenetre: fenetreQuestions,
  sol: solQuestions,
  garage: garageQuestions
};




const defaultValues = {
  fenetre: {
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
  },
  garage: {
    type_porte: 'Sectionnelle',
    dimensions: '2400 x 2340',
    motorisation: 'Oui',
    isolation: 'Oui',
    couleur: 'Blanc'
  },
  sol: {}
};

export default function RightPanel({ page, onVariablesChange }) {
  const questions = questionSets[page] || [];
  const [form, setForm] = useState(defaultValues[page] || {});

  // Met à jour l'aperçu central à chaque modification
  React.useEffect(() => {
    if (onVariablesChange) onVariablesChange(form);
    // eslint-disable-next-line
  }, [form]);

  const handleChange = e => {
    const { name, value, type } = e.target;
    setForm(f => ({ ...f, [name]: type === 'number' ? Number(value) : value }));
  };

  // Génère le PDF à partir de l'aperçu central
  const handleSave = async () => {
    const node = document.querySelector('.pdf-canvas-wrapper');
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    // Calcule la taille de l'image pour bien remplir la page
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    pdf.addImage(imgData, 'PNG', (pageWidth-imgWidth)/2, 40, imgWidth, imgHeight, undefined, 'FAST');
    pdf.save(`devis-${page}.pdf`);
  };

  return (
    <aside className="right-panel">
      <form className="panel-form" onSubmit={e => e.preventDefault()}>
        <h2>Modifier le devis</h2>
        {questions.map(q => (
          <div className="form-group" key={q.name}>
            <label htmlFor={q.name}>{q.label}</label>
            {q.type === 'select' ? (
              <select id={q.name} name={q.name} value={form[q.name] || ''} onChange={handleChange}>
                {q.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input id={q.name} name={q.name} type={q.type} value={form[q.name] || ''} onChange={handleChange} />
            )}
          </div>
        ))}
        <button type="button" className="save-btn" onClick={handleSave}>
          Sauvegarder en PDF
        </button>
      </form>
    </aside>
  );
}

