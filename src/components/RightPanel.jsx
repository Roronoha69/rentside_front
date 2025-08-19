import React, { useState } from 'react';
import '../styles/rightpanel.css';
import '../styles/rightpanel.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const fenetreQuestions = [
  // 1. Type de fenêtre
  { label: 'Type de fenêtre', name: 'type_fenetre', type: 'select', options: ['Fenêtre 1 vantail', 'Fenêtre 2 vantaux', 'Fenêtre 3 vantaux'] },
  // 2. Type d'ouverture
  { label: "Type d'ouverture", name: 'type_ouverture', type: 'select', options: ['Avec oscillo battant', 'Sans oscillo battant'] },
  // 3. Type de vitrage
  { label: 'Type de vitrage', name: 'type_vitrage', type: 'select', options: ['Double vitrage', 'Triple vitrage'] },
  // 4. Type de verre
  { label: 'Type de verre', name: 'type_verre', type: 'select', options: ['Standard', 'Verre mat', 'Verre sécurit'] },
  // 5. Autre (champ libre)
  { label: 'Spécifications supplémentaires', name: 'autre', type: 'textarea' },
  // 6. Type de projet
  { label: 'Type de projet', name: 'type_projet', type: 'select', options: ['Neuf', 'Rénovation'] },
  // 7. Type de pose
  { label: 'Type de pose', name: 'type_pose', type: 'select', options: ['En applique', 'En feuillure', 'En tunnel', 'En rénovation'] },
  // 8. Matériau des fenêtres
  { label: 'Matériau des fenêtres', name: 'materiau', type: 'select', options: ['Fenêtres PVC (Livraison 3 semaines)', 'Fenêtres BOIS (Livraison 6 semaines)', 'Fenêtres ALU (disponible aussi)'] },
  // 9. Couleurs des fenêtres
  { label: 'Couleur intérieure (RAL)', name: 'couleur_interieure', type: 'text' },
  { label: 'Couleur extérieure différente (RAL)', name: 'couleur_exterieure', type: 'text' },
  // 10. Options supplémentaires
  { label: "Inclure une porte d'entrée", name: 'porte_entree', type: 'checkbox' },
  // 11. Dimensions générales
  { label: 'Hauteur (cm)', name: 'hauteur', type: 'number' },
  { label: 'Largeur (cm)', name: 'largeur', type: 'number' },
  // 12. Quantité
  { label: 'Nombre de fenêtres (minimum 5 unités)', name: 'quantite', type: 'number' },
  { label: 'Ajouter à un devis existant', name: 'ajout_devis', type: 'checkbox' },
  // 13. Dimensions détaillées par fenêtre (sera géré dynamiquement)
  // 14. Options d'installation
  { label: 'Inclure la pose de mes fenêtres', name: 'inclure_pose', type: 'select', options: ['Oui', 'Non'] },
  { label: 'Dépose des fenêtres existantes', name: 'depose_existantes', type: 'select', options: ['Oui', 'Non'] },
  // 15. Sens d'ouverture (vantail principal)
  { label: "Sens d'ouverture (vantail principal)", name: 'sens_ouverture', type: 'select', options: ['Tirant gauche', 'Tirant droit'] },
  // 16. Petits bois
  { label: 'Petits bois', name: 'petits_bois', type: 'select', options: ['Sans', 'Intégrés', 'Collés'] },
  // 17. Ventilation
  { label: 'Ventilation', name: 'ventilation', type: 'select', options: ['Standard', 'Hygro'] },
  // 18. Volets roulants
  { label: 'Nombre de volets roulants', name: 'nb_volets', type: 'number' },
  { label: 'Type de volets roulants', name: 'type_volet', type: 'select', options: ['Monobloc', 'Rénovation'] },
  { label: 'Motorisation', name: 'motorisation_volet', type: 'select', options: ['Radio SOMFY', 'Filaire SIMU'] },
  // 19. Informations de contact
  { label: 'Nom (Entreprise)', name: 'nom_entreprise', type: 'text' },
  { label: 'Prénom', name: 'prenom', type: 'text' },
  { label: 'Email', name: 'email', type: 'email' },
  { label: 'Téléphone', name: 'telephone', type: 'text' },
  { label: 'Adresse de facturation', name: 'adresse_facturation', type: 'text' },
  { label: 'Code postal', name: 'code_postal', type: 'text' },
  { label: 'Ville', name: 'ville', type: 'text' },
  { label: 'Code partenaire', name: 'code_partenaire', type: 'text' },
  // 20. Adresse de livraison
  { label: 'Adresse de livraison différente ?', name: 'adresse_livraison_diff', type: 'checkbox' },
  // Les champs d'adresse livraison seront affichés dynamiquement si coché
  // 21. Description du projet
  { label: 'Votre projet en quelques mots', name: 'description_projet', type: 'textarea' },
];

const solQuestions = [
  { label: 'Type de sol', name: 'type_sol', type: 'select', options: ['Carrelage', 'Parquet', 'Moquette', 'Vinyle'] },
  { label: 'Surface (m²)', name: 'surface', type: 'number' },
  { label: 'Couleur', name: 'couleur', type: 'text' },
  { label: 'Finition', name: 'finition', type: 'select', options: ['Mat', 'Brillant', 'Satiné'] },
  { label: 'Plinthes incluses', name: 'plinthes', type: 'select', options: ['Oui', 'Non'] }
];

const garageQuestions = [
  // Informations client
  { label: 'Code client', name: 'client_code', type: 'text', placeholder: 'ex: CL01682' },
  { label: 'Nom client', name: 'client_name', type: 'text' },
  { label: 'Adresse client', name: 'client_address', type: 'text' },
  { label: 'Ville client', name: 'client_city', type: 'text' },
  
  // Adresse de livraison
  { label: 'Adresse de livraison différente ?', name: 'adresse_livraison_diff', type: 'checkbox' },
  { label: 'Adresse de livraison', name: 'delivery_address', type: 'text', condition: 'adresse_livraison_diff' },
  { label: 'Ville de livraison', name: 'delivery_city', type: 'text', condition: 'adresse_livraison_diff' },
  
  // Produits
  { label: 'Modèle de porte', name: 'model', type: 'select', options: ['ankara', 'castries', 'lima', 'riga'] },
  { label: 'Finition', name: 'finition', type: 'select', options: ['ral_7016_dark', 'wood_flat', 'ral_9010_blanc'] },
  { label: 'Largeur (mm)', name: 'width', type: 'number', placeholder: 'ex: 2400' },
  { label: 'Hauteur (mm)', name: 'height', type: 'number', placeholder: 'ex: 2000' },
  
  // Motorisation
  { label: 'Type motorisation', name: 'motor_type', type: 'select', options: ['manuelle', 'électrique'] },
  { label: 'Nombre de télécommandes', name: 'remote_count', type: 'number', condition: 'motor_type === "électrique"' },
  { label: 'Photocellules', name: 'photocells', type: 'checkbox', condition: 'motor_type === "électrique"' },
  
  // Options
  { label: 'Hublots', name: 'windows', type: 'select', options: ['sans', 'avec'] },
  { label: 'Portillon intégré', name: 'wicket_door', type: 'checkbox' },
  
  // Installation
  { label: 'Inclure la pose', name: 'installation_included', type: 'checkbox' },
  { label: 'Type de pose', name: 'installation_type', type: 'select', options: ['neuf', 'rénovation'], condition: 'installation_included' },
  { label: 'Dépose ancienne porte', name: 'old_door_removal', type: 'checkbox', condition: 'installation_included' },
  
  // Paiement
  { label: 'Mode de règlement', name: 'payment_method', type: 'select', options: ['Virement comptant', 'Chèque', 'CB'] }
];

const questionSets = {
  fenetre: fenetreQuestions,
  sol: solQuestions,
  garage: garageQuestions
};




const defaultValues = {
  fenetre: {
    type_fenetre: 'Fenêtre 2 vantaux',
    type_ouverture: 'Avec oscillo battant',
    type_vitrage: 'Double vitrage',
    type_verre: 'Standard',
    autre: '',
    type_projet: 'Neuf',
    type_pose: 'En applique',
    materiau: 'Fenêtres PVC (Livraison 3 semaines)',
    couleur_interieure: 'Blanc',
    couleur_exterieure: 'Blanc',
    porte_entree: false,
    hauteur: 1260,
    largeur: 1340,
    quantite: 5,
    ajout_devis: false,
    inclure_pose: 'Oui',
    depose_existantes: 'Non',
    sens_ouverture: 'Tirant gauche',
    petits_bois: 'Sans',
    ventilation: 'Standard',
    nb_volets: 0,
    type_volet: 'Monobloc',
    motorisation_volet: 'Radio SOMFY',
    nom_entreprise: 'SAS RENTSIDE',
    prenom: 'Client',
    email: 'client@example.com',
    telephone: '04 00 00 00 00',
    adresse_facturation: '22 allée Alan Turing',
    code_postal: '63000',
    ville: 'Clermont-Ferrand',
    code_partenaire: '',
    adresse_livraison_diff: false,
    description_projet: ''
  },
  garage: {
    // Informations client par défaut
    client_code: '',
    client_name: '',
    client_address: '',
    client_city: '',
    
    // Adresse de livraison par défaut
    adresse_livraison_diff: false,
    delivery_address: '',
    delivery_city: '',
    
    // Produit par défaut
    model: 'lima',
    finition: 'ral_9010_blanc',
    width: 2400,
    height: 2000,
    
    // Motorisation par défaut
    motor_type: 'électrique',
    remote_count: 2,
    photocells: true,
    
    // Options par défaut
    windows: 'sans',
    wicket_door: false,
    
    // Installation par défaut
    installation_included: true,
    installation_type: 'neuf',
    old_door_removal: true,
    
    // Paiement par défaut
    payment_method: 'Virement comptant'
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
    const { name, value, type, checked } = e.target;
    setForm(f => ({ 
      ...f, 
      [name]: type === 'number' ? Number(value) 
            : type === 'checkbox' ? checked 
            : value 
    }));
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
            ) : q.type === 'textarea' ? (
              <textarea 
                id={q.name} 
                name={q.name} 
                value={form[q.name] || ''} 
                onChange={handleChange}
                rows={3}
                placeholder={q.placeholder || ''}
              />
            ) : q.type === 'checkbox' ? (
              <div className="checkbox-wrapper">
                <input 
                  id={q.name} 
                  name={q.name} 
                  type="checkbox" 
                  checked={form[q.name] || false} 
                  onChange={handleChange} 
                />
                <span className="checkmark"></span>
              </div>
            ) : (
              <input 
                id={q.name} 
                name={q.name} 
                type={q.type} 
                value={form[q.name] || ''} 
                onChange={handleChange}
                placeholder={q.placeholder || ''}
              />
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

