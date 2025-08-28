import React, { useState, useEffect } from 'react';
import '../styles/quotesearch.css';

const downloadCSV = (data) => {
  const headers = ['N° Devis', 'Date', 'Type', 'Client', 'Adresse', 'Produit', 'Montant TTC', 'Statut'];
  const csvContent = [
    headers.join(','),
    ...data.map(quote => [
      quote.id,
      new Date(quote.created_at).toLocaleDateString('fr-FR'),
      'Garage',
      quote.client_name,
      quote.client_address,
      quote.model,
      `${quote.total_ttc.toFixed(2)} €`,
      quote.status
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
    montantMax: '',
    invoice_number: ''
  });

  const [sortBy, setSortBy] = useState('date');

  const handleViewPdf = async (invoiceId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quotes/garage/${invoiceId}/pdf`, {
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data.pdf_url) {
        window.open(data.data.pdf_url, '_blank');
      } else {
        console.error('URL du PDF non trouvée ou réponse invalide:', data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du PDF:', error);
    }
  };

  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const params = new URLSearchParams();
        // We only add filters to the query if they have a value
        if (filters.invoice_number) params.append('invoice_number', filters.invoice_number);
        if (filters.client) params.append('client', filters.client);
        if (filters.dateDebut) params.append('dateDebut', filters.dateDebut);
        if (filters.dateFin) params.append('dateFin', filters.dateFin);
        if (filters.montantMin) params.append('montantMin', filters.montantMin);
        if (filters.montantMax) params.append('montantMax', filters.montantMax);

        // The 'type' filter is handled here for now, assuming you might have different routes later
        const quoteType = filters.type === 'tous' ? 'garage' : filters.type;
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quotes/${quoteType}?${params.toString()}`, {
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setQuotes(data.data);
        } else {
          console.error('API response is not in expected format:', data);
          setQuotes([]); // Set to empty array on failure
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des devis:', error);
        setQuotes([]); // Set to empty array on error
      }
    };
    fetchQuotes();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'tous',
      dateDebut: '',
      dateFin: '',
      client: '',
      montantMin: '',
      montantMax: '',
      invoice_number: ''
    });
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
            name="invoice_number"
            value={filters.invoice_number}
            placeholder="N° de devis"
            onChange={handleFilterChange}
          />

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
        <button className="reset-btn" onClick={handleResetFilters}>Réinitialiser</button>
        <button 
          className="export-btn" 
          onClick={() => downloadCSV(quotes)}
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
            {quotes && quotes.map(quote => (
              <tr key={quote.id}>
                <td>{quote.id}</td>
                <td>{new Date(quote.created_at).toLocaleDateString('fr-FR')}</td>
                <td>Garage</td>
                <td>{quote.client_name}</td>
                <td>{quote.client_address}</td>
                <td>{quote.model}</td>
                <td>{quote.total_ttc.toFixed(2)} €</td>
                <td>
                  <span className={`status ${quote.status}`}>
                    {quote.status}
                  </span>
                </td>
                <td>
                  <button className="btn-view" onClick={() => handleViewPdf(quote.id)}>Voir</button>
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
