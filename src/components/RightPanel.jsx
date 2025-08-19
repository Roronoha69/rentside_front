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
  // 1. Modèle et spécifications
  { label: 'Modèle de porte', name: 'modele', type: 'select', options: ['ankara', 'castries', 'lima', 'riga'] },
  { label: 'Finition', name: 'finition', type: 'select', options: ['ral_7016_dark', 'wood_flat', 'ral_9010_blanc'] },
  
  // 2. Dimensions détaillées
  { label: 'Largeur (mm)', name: 'largeur', type: 'number' },
  { label: 'Hauteur (mm)', name: 'hauteur', type: 'number' },
  { label: 'Quantité', name: 'quantite', type: 'number' },
  
  // 3. Motorisation et accessoires
  { label: 'Motorisation', name: 'motorisation', type: 'select', options: ['Manuelle', 'Électrique'] },
  { label: 'Nombre de télécommandes', name: 'nb_telecommandes', type: 'number' },
  { label: 'Photocellules de sécurité', name: 'photocellules', type: 'checkbox' },
  { label: 'Feu clignotant', name: 'feu_clignotant', type: 'checkbox' },
  
  // 4. Options techniques
  { label: 'Type d’isolation', name: 'type_isolation', type: 'select', options: ['Standard', 'Renforcée', 'Premium'] },
  { label: 'Hublot(s)', name: 'hublots', type: 'select', options: ['Sans', '1 hublot', '2 hublots', '4 hublots'] },
  { label: 'Portillon intégré', name: 'portillon', type: 'checkbox' },
  { label: 'Serrure manuelle', name: 'serrure_manuelle', type: 'checkbox' },
  
  // 5. Installation et pose
  { label: 'Type de pose', name: 'type_pose', type: 'select', options: ['Neuf', 'Rénovation', 'Remplacement'] },
  { label: 'Inclure la pose', name: 'inclure_pose', type: 'select', options: ['Oui', 'Non'] },
  { label: 'Dépose ancienne porte', name: 'depose_ancienne', type: 'select', options: ['Oui', 'Non'] },
  { label: 'Évacuation déchets', name: 'evacuation_dechets', type: 'checkbox' },
  
  // 6. Informations client
  { label: 'Nom (Entreprise)', name: 'nom_entreprise', type: 'text' },
  { label: 'Prénom', name: 'prenom', type: 'text' },
  { label: 'Email', name: 'email', type: 'email' },
  { label: 'Téléphone', name: 'telephone', type: 'text' },
  { label: 'Adresse de facturation', name: 'adresse_facturation', type: 'textarea' },
  { label: 'Code postal', name: 'code_postal', type: 'text' },
  { label: 'Ville', name: 'ville', type: 'text' },
  { label: 'Code partenaire', name: 'code_partenaire', type: 'text' },
  
  // 7. Adresse de livraison
  { label: 'Adresse de livraison différente ?', name: 'adresse_livraison_diff', type: 'checkbox' },
  { label: 'Adresse de livraison', name: 'adresse_livraison', type: 'textarea' },
  { label: 'Code postal livraison', name: 'code_postal_livraison', type: 'text' },
  { label: 'Ville livraison', name: 'ville_livraison', type: 'text' },
  
  // 8. Informations complémentaires
  { label: 'Commentaires spéciaux', name: 'commentaires', type: 'textarea' },
  { label: 'Date de livraison souhaitée', name: 'date_livraison', type: 'date' },
  { label: 'Urgence', name: 'urgence', type: 'checkbox' }
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
    modele: 'castries',
    finition: 'ral_7016_dark',
    largeur: 2500,
    hauteur: 2125,
    quantite: 1,
    motorisation: 'Électrique',
    nb_telecommandes: 2,
    photocellules: true,
    feu_clignotant: true,
    type_isolation: 'Standard',
    hublots: 'Sans',
    portillon: false,
    serrure_manuelle: false,
    type_pose: 'Neuf',
    inclure_pose: 'Oui',
    depose_ancienne: 'Non',
    evacuation_dechets: false,
    nom_entreprise: 'SAS RENTSIDE',
    prenom: 'Client',
    email: 'client@example.com',
    telephone: '04 00 00 00 00',
    adresse_facturation: '22 allée Alan Turing',
    code_postal: '63000',
    ville: 'Clermont-Ferrand',
    code_partenaire: '',
    adresse_livraison_diff: false,
    adresse_livraison: '',
    code_postal_livraison: '',
    ville_livraison: '',
    commentaires: '',
    date_livraison: '',
    urgence: false
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

