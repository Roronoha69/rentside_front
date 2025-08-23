import React, { useState } from 'react';
import '../styles/quotesearch.css';

const downloadCSV = (data) => {
  const headers = ['N° Devis', 'Date', 'Type', 'Client', 'Adresse', 'Produit', 'Montant TTC', 'Statut'];
  const csvContent = [
    headers.join(','),
    ...data.map(quote => [
      quote.id,
      new Date(quote.date).toLocaleDateString('fr-FR'),
      quote.type,
      quote.client,
      quote.adresse,
      quote.produit,
      `${quote.montantTTC.toFixed(2)} €`,
      quote.statut
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `devis_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function QuoteSearch() {
  const [filters, setFilters] = useState({
    type: 'tous',
    dateDebut: '',
    dateFin: '',
    client: '',
    montantMin: '',
    montantMax: ''
  });

  const [sortBy, setSortBy] = useState('date');

  // Exemple de devis fictif
  const fakeQuotes = [
    {
      id: 'DE600689',
      date: '2025-08-15',
      type: 'garage',
      client: 'Martin DUPONT',
      adresse: '15 rue des Lilas, 63000 Clermont-Ferrand',
      produit: 'Porte de garage LIMA',
      montantHT: 659.99,
      montantTTC: 791.99,
      statut: 'validé'
    }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="quote-search">
      <div className="search-header">
        <div className="search-filters">
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="tous">Tous</option>
            <option value="garage">Portes de garage</option>
            <option value="fenetre">Fenêtres</option>
            <option value="sol">Sols</option>
          </select>

          <input 
            type="text"
            name="client"
            value={filters.client}
            placeholder="Nom du client"
            onChange={handleFilterChange}
          />

          <div className="date-range">
            <input 
              type="date" 
              name="dateDebut"
              value={filters.dateDebut}
              onChange={handleFilterChange}
            />
            <span>à</span>
            <input 
              type="date" 
              name="dateFin"
              value={filters.dateFin}
              onChange={handleFilterChange}
            />
          </div>

          <div className="amount-range">
            <input
              type="number"
              name="montantMin"
              value={filters.montantMin}
              placeholder="Min €"
              onChange={handleFilterChange}
            />
            <span>à</span>
            <input
              type="number"
              name="montantMax"
              value={filters.montantMax}
              placeholder="Max €"
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <button 
          className="export-btn" 
          onClick={() => downloadCSV(fakeQuotes)}
        >
          Exporter en CSV
        </button>
      </div>

      {/* Tableau des résultats */}
      <div className="quotes-table-container">
        <table className="quotes-table">
          <thead>
            <tr>
              <th>N° Devis</th>
              <th>
                <button 
                  className="sort-btn" 
                  onClick={() => setSortBy(sortBy === 'date' ? 'date-desc' : 'date')}
                >
                  Date {sortBy.includes('date') && (sortBy === 'date' ? '↑' : '↓')}
                </button>
              </th>
              <th>Type</th>
              <th>Client</th>
              <th>Adresse</th>
              <th>Produit</th>
              <th>Montant TTC</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fakeQuotes.map(quote => (
              <tr key={quote.id}>
                <td>{quote.id}</td>
                <td>{new Date(quote.date).toLocaleDateString('fr-FR')}</td>
                <td>{quote.type}</td>
                <td>{quote.client}</td>
                <td>{quote.adresse}</td>
                <td>{quote.produit}</td>
                <td>{quote.montantTTC.toFixed(2)} €</td>
                <td>
                  <span className={`status ${quote.statut}`}>
                    {quote.statut}
                  </span>
                </td>
                <td>
                  <button className="btn-view">Voir</button>
                  <button className="btn-edit">Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
