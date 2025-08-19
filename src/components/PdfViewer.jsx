import React, { useState } from 'react';
import '../styles/pdfviewer.css';
import logo from '../assets/rentside.png';
import {
  calculerSurface,
  calculerPerimetre,
  calculerPoids,
  determinerSysteme,
  determinerFerrures,
  calculerCoefficientUw,
  determinerVitrage,
  calculerPassageLumiere,
  genererReferenceClient,
  calculerDateExpiration,
  determinerDelaisFabrication,
  calculerAccessoires,
  calculerPrixEstimatif
} from '../utils/fenetreCalculs';

import {
  calculerDonneesTechniquesGarage
} from '../utils/garageCalculs';

const defaultFenetre = {
  type_fenetre: 'Fenêtre 2 vantaux',
  type_ouverture: 'Avec oscillo battant',
  type_vitrage: 'Double vitrage',
  type_verre: 'Standard',
  materiau: 'Fenêtres PVC (Livraison 3 semaines)',
  couleur_interieure: 'Blanc',
  couleur_exterieure: 'Blanc',
  hauteur: 1260,
  largeur: 1340,
  quantite: 1,
  nom_entreprise: 'SAS RENTSIDE',
  prenom: 'Client',
  email: 'client@example.com',
  telephone: '04 00 00 00 00',
  adresse_facturation: '22 allée Alan Turing',
  code_postal: '63000',
  ville: 'Clermont-Ferrand'
};
const defaultGarage = {
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
};

export default function PdfViewer({ page, variables, zoom = 1 }) {
  const [zoomState, setZoom] = useState(zoom);
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.6));

  const zoomStyle = {
    transform: `scale(${zoomState})`,
    transformOrigin: 'top left',
    width: `${100 / zoomState}%`,
    height: `${100 / zoomState}%`
  };

  // Calculs automatiques pour fenêtre
  const calculerDonneesTechniques = (donnees) => {
    if (!donnees.largeur || !donnees.hauteur) return {};
    
    const surface = calculerSurface(donnees.largeur, donnees.hauteur);
    const perimetre = calculerPerimetre(donnees.largeur, donnees.hauteur);
    const poids = calculerPoids(parseFloat(surface));
    const systeme = determinerSysteme(donnees.materiau || '', donnees.type_projet || '');
    const ferrures = determinerFerrures(donnees.type_ouverture || '');
    const uw = calculerCoefficientUw(donnees.type_vitrage || '', donnees.materiau || '');
    const vitrage = determinerVitrage(donnees.type_vitrage || '');
    const passageLumiere = calculerPassageLumiere(donnees.largeur, donnees.hauteur, donnees.type_fenetre || '');
    const referenceClient = genererReferenceClient();
    const dateExpiration = calculerDateExpiration();
    const delaisFabrication = determinerDelaisFabrication(donnees.materiau || '', donnees.quantite || 1);
    const accessoires = calculerAccessoires(donnees.largeur, donnees.hauteur, donnees.quantite || 1);
    const prixEstimatif = calculerPrixEstimatif(parseFloat(surface), donnees.materiau || '', {
      tripleVitrage: donnees.type_vitrage?.includes('Triple'),
      oscilloBattant: donnees.type_ouverture?.includes('oscillo'),
      voletRoulant: (donnees.nb_volets || 0) > 0
    });
    
    return {
      surface, perimetre, poids, systeme, ferrures, uw, vitrage,
      passageLumiere, referenceClient, dateExpiration, delaisFabrication,
      accessoires, prixEstimatif
    };
  };

  const donneesTech = page === 'fenetre' ? calculerDonneesTechniques({ ...defaultFenetre, ...(variables||{}) }) : {};
  const donneesTechGarage = page === 'garage' ? calculerDonneesTechniquesGarage({ ...defaultGarage, ...(variables||{}) }) : {};

  // Mock: utilise les variables par défaut si non fournies
  const data = page === 'fenetre' ? { ...defaultFenetre, ...(variables||{}) }
    : page === 'garage' ? { ...defaultGarage, ...(variables||{}) }
    : {};

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <button onClick={handleZoomOut} aria-label="Zoom out">-</button>
        <span>{Math.round(zoomState * 100)}%</span>
        <button onClick={handleZoomIn} aria-label="Zoom in">+</button>
      </div>
      <div className="pdf-canvas-wrapper" style={{ transform: `scale(${zoomState})` }}>
        {page === 'fenetre' && (
          <div className="devis-html fenetre">
            {/* En-tête professionnel enrichi */}
            <div className="devis-header">
              <div className="logo-section">
                <img src={logo} alt="Rentside" className="devis-logo" />
              </div>
              <div className="header-info">
                <div className="confirmation-info">
                  <strong>DEVIS N° 167893</strong><br/>
                  Réf.: {donneesTech.referenceClient}/RENTSIDE/2025<br/>
                  Date d'impression: {new Date().toLocaleDateString('fr-FR')} - {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}<br/>
                  <strong>Date d'expiration: {donneesTech.dateExpiration}</strong>
                </div>
              </div>
            </div>

            {/* Contact commercial */}
            <div className="commercial-contact">
              <div className="contact-info">
                <strong>Votre contact commercial:</strong> Service Devis Rentside<br/>
                Tél: 04 73 00 00 00 | Email: devis@rentside.fr
              </div>
            </div>

            {/* Informations client et livraison */}
            <div className="client-info-section">
              <div className="client-info">
                <h3>Informations Client</h3>
                <div className="info-block">
                  <strong>{data.nom_entreprise || 'SAS RENTSIDE'}</strong><br/>
                  {data.prenom || 'Client'}<br/>
                  {data.adresse_facturation || '22 allée Alan Turing'}<br/>
                  {data.code_postal || '63000'} {data.ville || 'Clermont-Ferrand'}<br/>
                  Tél: {data.telephone || '04 00 00 00 00'}<br/>
                  Email: {data.email || 'client@example.com'}<br/>
                  {data.code_partenaire && <span>Code partenaire: {data.code_partenaire}</span>}
                </div>
              </div>
              <div className="delivery-info">
                <h3>Adresse de Livraison</h3>
                <div className="info-block">
                  {data.adresse_livraison_diff ? (
                    <>
                      <strong>Adresse différente:</strong><br/>
                      {data.adresse_livraison || 'À préciser'}<br/>
                      {data.code_postal_livraison || ''} {data.ville_livraison || ''}
                    </>
                  ) : (
                    <>
                      <strong>Identique à l'adresse de facturation</strong><br/>
                      {data.adresse_facturation || '22 allée Alan Turing'}<br/>
                      {data.code_postal || '63000'} {data.ville || 'Clermont-Ferrand'}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Section technique principale enrichie */}
            <div className="technical-section">
              <div className="position-header">
                <span>Position n°1 - Quantité: {data.quantite || 1}</span>
                <span>Système: {donneesTech.systeme} - Fenêtres</span>
                <span>Type: {data.type_fenetre || 'Fenêtre 2 vantaux'}</span>
              </div>

              <div className="technical-content">
                {/* Vues et schémas enrichis */}
                <div className="window-views">
                  <div className="view-section">
                    <h4>Vue intérieure</h4>
                    <div className="window-diagram">
                      <div className="window-frame">
                        <div className="window-dimensions">{data.largeur || 1340} mm</div>
                        <div className="window-height">{data.hauteur || 1260} mm</div>
                        <div className="window-panels">
                          {data.type_fenetre?.includes('2 vantaux') ? (
                            <>
                              <div className="panel">1</div>
                              <div className="panel">2</div>
                            </>
                          ) : data.type_fenetre?.includes('3 vantaux') ? (
                            <>
                              <div className="panel">1</div>
                              <div className="panel">2</div>
                              <div className="panel">3</div>
                            </>
                          ) : (
                            <div className="panel">1</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="view-section">
                    <h4>Vue extérieure</h4>
                    <div className="window-diagram">
                      <div className="window-frame">
                        <div className="window-panels">
                          {data.type_fenetre?.includes('2 vantaux') ? (
                            <>
                              <div className="panel">1</div>
                              <div className="panel">2</div>
                            </>
                          ) : data.type_fenetre?.includes('3 vantaux') ? (
                            <>
                              <div className="panel">1</div>
                              <div className="panel">2</div>
                              <div className="panel">3</div>
                            </>
                          ) : (
                            <div className="panel">1</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spécifications techniques complètes */}
                <div className="specifications">
                  <div className="spec-table">
                    <h4>Dimensions et calculs</h4>
                    <table>
                      <tbody>
                        <tr><td>Largeur extérieure</td><td>{data.largeur || 1340} mm</td></tr>
                        <tr><td>Hauteur extérieure</td><td>{data.hauteur || 1260} mm</td></tr>
                        <tr><td>Surface unitaire</td><td>{donneesTech.surface} m²</td></tr>
                        <tr><td>Surface totale ({data.quantite || 1} pcs)</td><td>{(parseFloat(donneesTech.surface || 0) * (data.quantite || 1)).toFixed(2)} m²</td></tr>
                        <tr><td>Périmètre</td><td>{donneesTech.perimetre} m</td></tr>
                        <tr><td>Poids unitaire</td><td>{donneesTech.poids} kg</td></tr>
                        <tr><td>Poids total</td><td>{(parseFloat(donneesTech.poids || 0) * (data.quantite || 1)).toFixed(1)} kg</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="spec-table">
                    <h4>Système et matériau</h4>
                    <table>
                      <tbody>
                        <tr><td>Système profilé</td><td>{donneesTech.systeme}</td></tr>
                        <tr><td>Matériau</td><td>{data.materiau || 'Fenêtres PVC'}</td></tr>
                        <tr><td>Type de projet</td><td>{data.type_projet || 'Neuf'}</td></tr>
                        <tr><td>Type de pose</td><td>{data.type_pose || 'En applique'}</td></tr>
                        <tr><td>Couleur intérieure</td><td>{data.couleur_interieure || 'Blanc'}</td></tr>
                        <tr><td>Couleur extérieure</td><td>{data.couleur_exterieure || 'Blanc'}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="spec-table">
                    <h4>Vitrage technique</h4>
                    <table>
                      <tbody>
                        <tr><td>Type vitrage</td><td>{data.type_vitrage || 'Double vitrage'}</td></tr>
                        <tr><td>Composition</td><td>{donneesTech.vitrage?.composition}</td></tr>
                        <tr><td>Type intercalaire</td><td>{donneesTech.vitrage?.intercalaire}</td></tr>
                        <tr><td>Coefficient Ug</td><td>{donneesTech.vitrage?.ug} W/m²K</td></tr>
                        <tr><td>Facteur solaire g</td><td>{donneesTech.vitrage?.g}</td></tr>
                        <tr><td>Transmission lumineuse Lt</td><td>{donneesTech.vitrage?.lt}</td></tr>
                        <tr><td>Type de verre</td><td>{data.type_verre || 'Standard'}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="spec-table">
                    <h4>Ferrures et quincaillerie</h4>
                    <table>
                      <tbody>
                        <tr><td>Système ferrures</td><td>{donneesTech.ferrures}</td></tr>
                        <tr><td>Type d'ouverture</td><td>{data.type_ouverture || 'Avec oscillo battant'}</td></tr>
                        <tr><td>Sens d'ouverture</td><td>{data.sens_ouverture || 'Tirant gauche'}</td></tr>
                        <tr><td>Classe sécurité</td><td>RC1 (Standard résidentiel)</td></tr>
                        <tr><td>Type poignée</td><td>Poignée standard chromée</td></tr>
                        <tr><td>Hauteur poignée</td><td>1050 mm depuis sol</td></tr>
                        {data.porte_entree && <tr><td>Cylindre</td><td>Cylindre européen 30/30</td></tr>}
                      </tbody>
                    </table>
                  </div>

                  <div className="spec-table">
                    <h4>Performance thermique et acoustique</h4>
                    <table>
                      <tbody>
                        <tr><td>Coefficient Uw fenêtre</td><td>{donneesTech.uw} W/m²K <span className="performance-badge">Excellent</span></td></tr>
                        <tr><td>Étanchéité à l'air</td><td>Classe 4 (≤ 3 m³/h.m²)</td></tr>
                        <tr><td>Étanchéité à l'eau</td><td>Classe 9A (600 Pa)</td></tr>
                        <tr><td>Résistance au vent</td><td>Classe C4 (1200 Pa)</td></tr>
                        <tr><td>Performance acoustique</td><td>Rw ≈ 32 dB (estimation)</td></tr>
                        <tr><td>Drainage</td><td>Évacuation dormant + vantail</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails d'ouverture et passage de lumière */}
            <div className="opening-details">
              <h4>Détails techniques et passage de lumière utile</h4>
              <div className="technical-highlight">
                <ul>
                  <li><strong>Passage de lumière vantail 1:</strong> {donneesTech.passageLumiere?.vantail1 || '610 x 1140'} mm</li>
                  {donneesTech.passageLumiere?.vantail2 && (
                    <li><strong>Passage de lumière vantail 2:</strong> {donneesTech.passageLumiere.vantail2} mm</li>
                  )}
                  <li><strong>Système de drainage:</strong> Évacuation par dormant et vantail avec siphons</li>
                  <li><strong>Type de soudure:</strong> Soudure d'angle renforcée par équerres métalliques</li>
                  <li><strong>Ventilation:</strong> {data.ventilation || 'Standard'} - Aération réglable</li>
                  {data.petits_bois !== 'Sans' && (
                    <li><strong>Petits bois:</strong> {data.petits_bois} - Collés sur vitrage</li>
                  )}
                  {(data.nb_volets || 0) > 0 && (
                    <li><strong>Volets roulants:</strong> {data.nb_volets} volet(s) {data.type_volet} - Motorisation {data.motorisation_volet}</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Accessoires automatiques */}
            {donneesTech.accessoires && (
              <div className="accessories-section">
                <div className="spec-table">
                  <h4>Accessoires inclus automatiquement</h4>
                  <table>
                    <tbody>
                      <tr>
                        <td>{donneesTech.accessoires.piecesAppui?.description}</td>
                        <td>{donneesTech.accessoires.piecesAppui?.quantite} pcs</td>
                      </tr>
                      <tr>
                        <td>{donneesTech.accessoires.cornières?.description}</td>
                        <td>{donneesTech.accessoires.cornières?.quantite} pcs</td>
                      </tr>
                      <tr>
                        <td>{donneesTech.accessoires.tapeeIsolation?.description}</td>
                        <td>{donneesTech.accessoires.tapeeIsolation?.quantite} pcs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Récapitulatif final professionnel */}
            <div className="summary-section">
              <h4>Récapitulatif de la commande</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span>Surface totale vitrée:</span>
                  <strong>{(parseFloat(donneesTech.surface || 0) * (data.quantite || 1)).toFixed(2)} m²</strong>
                </div>
                <div className="summary-item">
                  <span>Poids total livraison:</span>
                  <strong>{(parseFloat(donneesTech.poids || 0) * (data.quantite || 1)).toFixed(1)} kg</strong>
                </div>
                <div className="summary-item">
                  <span>Délai de fabrication:</span>
                  <strong>{donneesTech.delaisFabrication}</strong>
                </div>
                <div className="summary-item">
                  <span>Référence client:</span>
                  <strong>{donneesTech.referenceClient}</strong>
                </div>
              </div>
              
              <div className="summary-total">
                Prix estimatif: {donneesTech.prixEstimatif} € HT
                <br/><em style={{fontSize: '0.9rem', fontWeight: 'normal'}}>Prix indicatif - Devis détaillé sur demande</em>
              </div>
            </div>

            {/* Conditions générales */}
            <div className="conditions-section">
              <h5>Conditions et modalités</h5>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.8rem'}}>
                <div>
                  <strong>Mode de paiement:</strong> Virement bancaire<br/>
                  <strong>Acompte:</strong> 40% à la commande<br/>
                  <strong>Solde:</strong> À la livraison
                </div>
                <div>
                  <strong>Livraison:</strong> Franco de port<br/>
                  <strong>Installation:</strong> {data.inclure_pose === 'Oui' ? 'Incluse' : 'Non incluse'}<br/>
                  <strong>Garantie:</strong> 10 ans fabricant
                </div>
              </div>
              <div style={{marginTop: '10px', fontSize: '0.75rem', color: '#666'}}>
                Devis valable jusqu'au <strong>{donneesTech.dateExpiration}</strong> - Conditions générales Rentside applicables
              </div>
            </div>
          </div>
        )}
        {page === 'garage' && (
          <div className="devis-html garage-invoice">
            {/* En-tête entreprise */}
            <div className="invoice-header">
              <div className="company-info">
                <strong>SAS RENTSIDE</strong><br/>
                22 allée Alan Turing<br/>
                63000 CLERMONT-FERRAND<br/>
                Tél : 04.15.81.18.34<br/>
                Tél portable : 06.32.95.81.07<br/>
                Site web : www.rentside.fr<br/>
                Email : info.rentside@gmail.com
              </div>
              <div className="logo-section">
                <img src={logo} alt="Rentside" className="company-logo" />
              </div>
            </div>

            {/* Adresses client et livraison */}
            <div className="addresses-section">
              <div className="billing-address">
                <strong>Adresse Livraison</strong><br/>
                {data.adresse_livraison_diff ? (
                  <>
                    {data.adresse_livraison}<br/>
                    {data.code_postal_livraison} {data.ville_livraison}
                  </>
                ) : (
                  <>
                    {data.adresse_facturation}<br/>
                    {data.code_postal} {data.ville}
                  </>
                )}
              </div>
              <div className="delivery-info">
                <strong>{data.nom_entreprise}</strong><br/>
                {data.adresse_facturation}<br/>
                {data.code_postal} {data.ville}
              </div>
            </div>

            {/* Informations devis */}
            <div className="quote-info-box">
              <div className="quote-header">
                <strong>Devis</strong>
              </div>
              <div className="quote-details">
                <div className="quote-row">
                  <span>Date :</span>
                  <span>{new Date().toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="quote-row">
                  <span>Numéro</span>
                  <span>DE600689</span>
                </div>
                <div className="quote-subheader">
                  <div>Code client</div>
                  <div>Date de validité</div>
                  <div>Mode de règlement</div>
                </div>
                <div className="quote-subrow">
                  <div>CL01648</div>
                  <div>{donneesTechGarage.dateExpiration}</div>
                  <div></div>
                </div>
                <div className="tva-row">
                  <span>N° de TVA Intracom :</span>
                </div>
              </div>
            </div>

            {/* Tableau des produits */}
            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Qté</th>
                    <th>P.U. HT</th>
                    <th>Montant HT</th>
                    <th>Montant TTC</th>
                    <th>TVA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PORTE{data.modele?.toUpperCase()}</td>
                    <td>
                      <strong>PORTE DE GARAGE SECTIONNELLE {data.modele?.toUpperCase()}</strong><br/>
                      Finition: {donneesTechGarage.finitionDescription}<br/>
                      Dimensions: {data.largeur} x {data.hauteur} mm<br/>
                      {data.motorisation === 'Électrique' && 'Motorisation électrique incluse'}<br/>
                      {data.photocellules && 'Photocellules de sécurité'}<br/>
                      {data.feu_clignotant && 'Feu clignotant'}<br/>
                      {data.nb_telecommandes > 0 && `${data.nb_telecommandes} télécommandes`}
                    </td>
                    <td>{data.quantite || 1}</td>
                    <td>{Math.round(donneesTechGarage.prixUnitaire || 1500)},00</td>
                    <td>{Math.round((donneesTechGarage.prixUnitaire || 1500) * (data.quantite || 1))},00</td>
                    <td>{Math.round((donneesTechGarage.prixUnitaire || 1500) * (data.quantite || 1) * 1.2)},00</td>
                    <td>20,00</td>
                  </tr>
                  {data.inclure_pose === 'Oui' && (
                    <tr>
                      <td>POSE</td>
                      <td>
                        <strong>POSE ET INSTALLATION</strong><br/>
                        Installation complète de la porte de garage<br/>
                        {data.depose_ancienne === 'Oui' && 'Dépose ancienne porte incluse'}<br/>
                        {data.evacuation_dechets && 'Évacuation déchets incluse'}
                      </td>
                      <td>1,00</td>
                      <td>350,00</td>
                      <td>350,00</td>
                      <td>420,00</td>
                      <td>20,00</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Note et conditions */}
            <div className="invoice-note">
              Devis gratuit. Les prix TTC sont établis sur la base des taux de TVA en vigueur à la date de remise de l'offre. Toute variation de ces taux sera répercutée sur
              les prix de vente.<br/>
              En validant ce devis, le client reconnaît avoir pris connaissance des CGV et de les accepter sans réserve.
            </div>

            {/* Totaux */}
            <div className="totals-section">
              <div className="totals-table">
                <div className="total-row">
                  <span>Taux</span>
                  <span>Base HT</span>
                  <span>Montant TVA</span>
                </div>
                <div className="total-row">
                  <span>20,00</span>
                  <span>{Math.round((donneesTechGarage.prixUnitaire || 1500) * (data.quantite || 1) + (data.inclure_pose === 'Oui' ? 350 : 0))},00</span>
                  <span>{Math.round(((donneesTechGarage.prixUnitaire || 1500) * (data.quantite || 1) + (data.inclure_pose === 'Oui' ? 350 : 0)) * 0.2)},00</span>
                </div>
              </div>
              <div className="final-totals">
                <div className="total-line">
                  <span>Total HT</span>
                  <span>{Math.round((donneesTechGarage.prixUnitaire || 1500) * (data.quantite || 1) + (data.inclure_pose === 'Oui' ? 350 : 0))},00</span>
                </div>
                <div className="total-line">
                  <span>Total TVA</span>
                  <span>{Math.round(((donneesTechGarage.prixUnitaire || 1500) * (data.quantite || 1) + (data.inclure_pose === 'Oui' ? 350 : 0)) * 0.2)},00</span>
                </div>
                <div className="total-line">
                  <span>Total TTC</span>
                  <span>{Math.round(((donneesTechGarage.prixUnitaire || 1500) * (data.quantite || 1) + (data.inclure_pose === 'Oui' ? 350 : 0)) * 1.2)},00</span>
                </div>
                <div className="total-line final">
                  <span><strong>Net à payer</strong></span>
                  <span><strong>{Math.round(((donneesTechGarage.prixUnitaire || 1500) * (data.quantite || 1) + (data.inclure_pose === 'Oui' ? 350 : 0)) * 1.2)},00 €</strong></span>
                </div>
              </div>
            </div>

            {/* Coordonnées bancaires */}
            <div className="bank-details">
              <strong>Coordonnées bancaires société :</strong><br/>
              Banque : CREDIT AGRICOLE<br/>
              Code banque : 16807 - Code guichet : 00036<br/>
              IBAN : FR761680700010066119C207S306<br/>
              BIC : AGRIFRPP868
            </div>

            {/* Pied de page */}
            <div className="invoice-footer">
              Siret : 91308679900116 - APE : 4613Z - RCS : 913086799 - N° TVA Intracom : FR09913086799 - Capital : 6 500,00 €<br/>
              <div style={{textAlign: 'right', marginTop: '10px'}}>1 sur 1</div>
            </div>
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
