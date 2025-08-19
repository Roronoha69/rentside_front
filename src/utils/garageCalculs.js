// Utilitaire de calculs techniques pour devis porte de garage professionnel
// Logique métier et calculs automatiques selon spécifications Rentside

/**
 * Calcule la surface de la porte de garage en m²
 */
export const calculerSurfaceGarage = (largeur, hauteur) => {
  if (!largeur || !hauteur) return '0.00';
  const surface = (largeur * hauteur) / 1000000; // mm² → m²
  return surface.toFixed(2);
};

/**
 * Calcule le périmètre de la porte en m
 */
export const calculerPerimetreGarage = (largeur, hauteur) => {
  if (!largeur || !hauteur) return '0.00';
  const perimetre = 2 * (largeur + hauteur) / 1000; // mm → m
  return perimetre.toFixed(2);
};

/**
 * Calcule le poids estimé de la porte selon matériau et dimensions
 */
export const calculerPoidsGarage = (largeur, hauteur, modele) => {
  const surface = parseFloat(calculerSurfaceGarage(largeur, hauteur));
  let poidsAuM2 = 15; // kg/m² par défaut
  
  // Poids selon le modèle
  switch(modele?.toLowerCase()) {
    case 'ankara':
      poidsAuM2 = 18; // Modèle renforcé
      break;
    case 'castries':
      poidsAuM2 = 16; // Modèle standard+
      break;
    case 'lima':
      poidsAuM2 = 14; // Modèle léger
      break;
    case 'riga':
      poidsAuM2 = 17; // Modèle premium
      break;
    default:
      poidsAuM2 = 15;
  }
  
  return (surface * poidsAuM2).toFixed(1);
};

/**
 * Détermine le type de motorisation selon les spécifications
 */
export const determinerMotorisation = (motorisation, largeur, hauteur) => {
  if (motorisation === 'Manuelle') {
    return {
      type: 'Manuelle',
      description: 'Ouverture manuelle avec ressorts de compensation',
      puissance: 'N/A',
      telecommandes: 0
    };
  }
  
  const surface = parseFloat(calculerSurfaceGarage(largeur, hauteur));
  let puissance = '550W'; // Puissance par défaut
  
  if (surface > 12) {
    puissance = '800W'; // Porte large
  } else if (surface > 8) {
    puissance = '700W'; // Porte moyenne
  }
  
  return {
    type: 'Électrique',
    description: `Motorisation électrique ${puissance} avec rail de guidage`,
    puissance,
    telecommandes: 2
  };
};

/**
 * Détermine les spécifications du modèle
 */
export const determinerSpecificationsModele = (modele) => {
  const specifications = {
    ankara: {
      nom: 'ANKARA',
      description: 'Porte sectionnelle premium avec isolation renforcée',
      isolation: 'Polyuréthane 42mm',
      resistance: 'Classe 4 (vent fort)',
      etancheite: 'IP65',
      garantie: '10 ans'
    },
    castries: {
      nom: 'CASTRIES',
      description: 'Porte sectionnelle standard résidentielle',
      isolation: 'Polyuréthane 40mm',
      resistance: 'Classe 3 (vent modéré)',
      etancheite: 'IP54',
      garantie: '8 ans'
    },
    lima: {
      nom: 'LIMA',
      description: 'Porte sectionnelle économique',
      isolation: 'Mousse polyuréthane 35mm',
      resistance: 'Classe 2 (vent léger)',
      etancheite: 'IP44',
      garantie: '5 ans'
    },
    riga: {
      nom: 'RIGA',
      description: 'Porte sectionnelle haut de gamme',
      isolation: 'Polyuréthane 45mm + pare-vapeur',
      resistance: 'Classe 5 (vent très fort)',
      etancheite: 'IP67',
      garantie: '12 ans'
    }
  };
  
  return specifications[modele?.toLowerCase()] || specifications.castries;
};

/**
 * Détermine les finitions disponibles
 */
export const determinerFinition = (finition) => {
  const finitions = {
    ral_7016_dark: {
      nom: 'RAL 7016 Gris Anthracite',
      description: 'Finition laquée mate premium',
      supplement: 0
    },
    wood_flat: {
      nom: 'Wood Flat Chêne',
      description: 'Aspect bois naturel avec protection UV',
      supplement: 150
    },
    ral_9010_blanc: {
      nom: 'RAL 9010 Blanc Pur',
      description: 'Finition laquée brillante standard',
      supplement: 0
    }
  };
  
  return finitions[finition] || finitions.ral_9010_blanc;
};

/**
 * Calcule les accessoires automatiques selon configuration
 */
export const calculerAccessoiresGarage = (motorisation, largeur, hauteur) => {
  const accessoires = {
    ressorts: {
      description: 'Ressorts de compensation galvanisés',
      quantite: largeur > 3000 ? 2 : 1,
      inclus: true
    },
    rails: {
      description: 'Rails de guidage acier galvanisé',
      quantite: 1,
      inclus: true
    },
    serrure: {
      description: 'Serrure 3 points avec cylindre européen',
      quantite: motorisation === 'Manuelle' ? 1 : 0,
      inclus: true
    }
  };
  
  if (motorisation !== 'Manuelle') {
    accessoires.photocellules = {
      description: 'Photocellules de sécurité',
      quantite: 1,
      inclus: true
    };
    accessoires.feu_clignotant = {
      description: 'Feu clignotant de signalisation',
      quantite: 1,
      inclus: true
    };
  }
  
  return accessoires;
};

/**
 * Calcule le coefficient d'isolation thermique Ud
 */
export const calculerCoefficientUd = (modele, finition) => {
  const specs = determinerSpecificationsModele(modele);
  let ud = 1.2; // Valeur par défaut
  
  switch(modele?.toLowerCase()) {
    case 'ankara':
      ud = 0.8; // Excellent
      break;
    case 'castries':
      ud = 1.0; // Très bon
      break;
    case 'lima':
      ud = 1.4; // Correct
      break;
    case 'riga':
      ud = 0.7; // Exceptionnel
      break;
  }
  
  return ud.toFixed(1);
};

/**
 * Génère une référence client unique
 */
export const genererReferenceClientGarage = () => {
  const date = new Date();
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const jour = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `PG${annee}${mois}${jour}${random}`;
};

/**
 * Calcule la date d'expiration du devis (30 jours)
 */
export const calculerDateExpirationGarage = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString('fr-FR');
};

/**
 * Détermine les délais de fabrication selon modèle et motorisation
 */
export const determinerDelaisFabricationGarage = (modele, motorisation, quantite = 1) => {
  let delaisBase = 3; // semaines
  
  switch(modele?.toLowerCase()) {
    case 'ankara':
      delaisBase = 4; // Modèle premium
      break;
    case 'riga':
      delaisBase = 5; // Haut de gamme
      break;
    case 'lima':
      delaisBase = 2; // Standard
      break;
    default:
      delaisBase = 3;
  }
  
  if (motorisation !== 'Manuelle') {
    delaisBase += 1; // +1 semaine pour motorisation
  }
  
  if (quantite > 1) {
    delaisBase += Math.ceil(quantite / 2); // +1 semaine par 2 portes supplémentaires
  }
  
  return `${delaisBase} semaines`;
};

/**
 * Calcule le prix estimatif selon configuration
 */
export const calculerPrixEstimatifGarage = (largeur, hauteur, modele, finition, motorisation, quantite = 1) => {
  const surface = parseFloat(calculerSurfaceGarage(largeur, hauteur));
  let prixBase = 400; // €/m² base
  
  // Prix selon modèle
  switch(modele?.toLowerCase()) {
    case 'ankara':
      prixBase = 550;
      break;
    case 'castries':
      prixBase = 450;
      break;
    case 'lima':
      prixBase = 350;
      break;
    case 'riga':
      prixBase = 650;
      break;
  }
  
  let prixUnitaire = surface * prixBase;
  
  // Supplément finition
  const finitionSpec = determinerFinition(finition);
  prixUnitaire += finitionSpec.supplement;
  
  // Supplément motorisation
  if (motorisation !== 'Manuelle') {
    prixUnitaire += 800; // Motorisation électrique
  }
  
  const prixTotal = prixUnitaire * quantite;
  
  return Math.round(prixTotal).toLocaleString('fr-FR');
};

/**
 * Calcule toutes les données techniques d'un coup
 */
export const calculerDonneesTechniquesGarage = (donnees) => {
  const {
    largeur = 2500,
    hauteur = 2125,
    modele = 'castries',
    finition = 'ral_9010_blanc',
    motorisation = 'Électrique',
    quantite = 1
  } = donnees;

  return {
    surface: calculerSurfaceGarage(largeur, hauteur),
    perimetre: calculerPerimetreGarage(largeur, hauteur),
    poids: calculerPoidsGarage(largeur, hauteur, modele),
    specifications: determinerSpecificationsModele(modele),
    finitionDetails: determinerFinition(finition),
    motorisationDetails: determinerMotorisation(motorisation, largeur, hauteur),
    ud: calculerCoefficientUd(modele, finition),
    accessoires: calculerAccessoiresGarage(motorisation, largeur, hauteur),
    referenceClient: genererReferenceClientGarage(),
    dateExpiration: calculerDateExpirationGarage(),
    delaisFabrication: determinerDelaisFabricationGarage(modele, motorisation, quantite),
    prixEstimatif: calculerPrixEstimatifGarage(largeur, hauteur, modele, finition, motorisation, quantite)
  };
};
