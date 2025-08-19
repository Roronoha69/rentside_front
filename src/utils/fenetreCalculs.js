// Utilitaires de calculs techniques pour devis fenêtre
// Logique métier des fabricants professionnels

export const calculerSurface = (largeur, hauteur) => {
  // Conversion mm² → m²
  return ((largeur * hauteur) / 1000000).toFixed(2);
};

export const calculerPerimetre = (largeur, hauteur) => {
  // Conversion mm → m
  return (2 * (largeur + hauteur) / 1000).toFixed(2);
};

export const calculerPoids = (surface) => {
  // ~25kg/m² pour fenêtre PVC standard
  return (surface * 25).toFixed(1);
};

export const determinerSysteme = (materiau, typeProjet) => {
  if (materiau.includes('PVC')) {
    return typeProjet === 'Rénovation' ? 'IGLO 5 RENO' : 'IGLO 5 CLASSIC';
  }
  if (materiau.includes('ALU')) {
    return 'HEROAL C 50';
  }
  if (materiau.includes('BOIS')) {
    return 'SOFTLINE 68';
  }
  return 'IGLO 5 CLASSIC';
};

export const determinerFerrures = (typeOuverture) => {
  const ferrures = {
    'Avec oscillo battant': 'UR-D (Oscillo-battant)',
    'Sans oscillo battant': 'R-D (Ouvrant simple)',
    'Fixe': 'Sans ferrure',
    'Coulissant': 'PSK (Parallèle-coulissant)'
  };
  return ferrures[typeOuverture] || 'UR-D (Oscillo-battant)';
};

export const calculerCoefficientUw = (typeVitrage, materiau) => {
  // Coefficients thermiques approximatifs
  const coefficients = {
    'Double vitrage': {
      'PVC': '1.3',
      'ALU': '1.8',
      'BOIS': '1.4'
    },
    'Triple vitrage': {
      'PVC': '0.9',
      'ALU': '1.2', 
      'BOIS': '1.0'
    }
  };
  
  const materiauKey = materiau.includes('PVC') ? 'PVC' : 
                     materiau.includes('ALU') ? 'ALU' : 'PVC';
  
  return coefficients[typeVitrage]?.[materiauKey] || '1.3';
};

export const determinerVitrage = (typeVitrage) => {
  const vitrages = {
    'Double vitrage': {
      composition: '4/16/4',
      intercalaire: 'Standard',
      ug: '1.1',
      g: '0.63',
      lt: '0.81'
    },
    'Triple vitrage': {
      composition: '4/16/4/16/4',
      intercalaire: 'Warm Edge',
      ug: '0.7',
      g: '0.50',
      lt: '0.70'
    }
  };
  return vitrages[typeVitrage] || vitrages['Double vitrage'];
};

export const calculerPassageLumiere = (largeur, hauteur, typeOuverture) => {
  // Calcul approximatif du passage de lumière utile
  // Soustraction des profils (environ 120mm de largeur totale)
  const largeurUtile = Math.max(0, largeur - 120);
  const hauteurUtile = Math.max(0, hauteur - 120);
  
  if (typeOuverture.includes('2 vantaux')) {
    return {
      vantail1: `${Math.floor(largeurUtile/2)} x ${hauteurUtile}`,
      vantail2: `${Math.floor(largeurUtile/2)} x ${hauteurUtile}`
    };
  }
  
  return {
    vantail1: `${largeurUtile} x ${hauteurUtile}`
  };
};

export const genererReferenceClient = () => {
  // Génère une référence client unique
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `RC${year}${month}${random}`;
};

export const calculerDateExpiration = () => {
  // Date d'expiration : 30 jours à partir d'aujourd'hui
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString('fr-FR');
};

export const determinerDelaisFabrication = (materiau, quantite) => {
  // Délais selon matériau et quantité
  let delaiBase = 21; // 3 semaines par défaut
  
  if (materiau.includes('ALU')) delaiBase = 28; // 4 semaines
  if (materiau.includes('BOIS')) delaiBase = 35; // 5 semaines
  
  // Ajout selon quantité
  if (quantite > 10) delaiBase += 7;
  if (quantite > 20) delaiBase += 7;
  
  return `${delaiBase} jours ouvrés`;
};

export const calculerAccessoires = (largeur, hauteur, quantite) => {
  return {
    piecesAppui: {
      longueur: Math.ceil(largeur / 1000), // Arrondi au mètre supérieur
      quantite: quantite,
      description: `Pièces d'appui ${Math.ceil(largeur / 1000)}m`
    },
    cornières: {
      quantite: quantite * 2, // 2 cornières par fenêtre
      description: 'Cornières de finition'
    },
    tapeeIsolation: {
      quantite: quantite,
      description: 'Tapée d\'isolation selon épaisseur mur'
    }
  };
};

export const calculerPrixEstimatif = (surface, materiau, options = {}) => {
  // Prix approximatifs au m² (à adapter selon tarifs réels)
  let prixBase = 350; // PVC standard
  
  if (materiau.includes('ALU')) prixBase = 450;
  if (materiau.includes('BOIS')) prixBase = 550;
  
  // Majorations selon options
  if (options.tripleVitrage) prixBase += 80;
  if (options.oscilloBattant) prixBase += 50;
  if (options.voletRoulant) prixBase += 200;
  
  return (surface * prixBase).toFixed(0);
};
