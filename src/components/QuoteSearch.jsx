import React, { useState, useEffect } from 'react';
import '../styles/quotesearch.css';

const UI_TYPE_TO_API_TYPE = {
  garage: 'garage',
  fenetre: 'window',
  sol: 'floor',
};

const formatQuoteTypeLabel = (apiType) => {
  if (apiType === 'garage') return 'Garage';
  if (apiType === 'window') return 'Fenêtre';
  if (apiType === 'floor') return 'Sol';
  return apiType || '—';
};

const getQuoteProductLabel = (quote) => {
  if (quote?._type === 'garage') return quote.model || quote.products?.[0]?.description || '—';
  if (quote?._type === 'window') {
    return quote.products?.[0]?.description || quote.technical_specs?.window_type || '—';
  }
  return quote.model || quote.products?.[0]?.description || '—';
};

const toNumberOrNull = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').trim();
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const formatEur = (value) => {
  const n = toNumberOrNull(value);
  if (n == null) return '—';
  return `${n.toFixed(2)} €`;
};

const downloadCSV = (data) => {
  const headers = ['N° Devis', 'Date', 'Type', 'Client', 'Adresse', 'Produit', 'Montant TTC', 'Statut'];
  const csvContent = [
    headers.join(','),
    ...data.map(quote => [
      quote.id,
      new Date(quote.created_at).toLocaleDateString('fr-FR'),
      formatQuoteTypeLabel(quote._type),
      quote.client_name,
      quote.client_address,
      getQuoteProductLabel(quote),
      formatEur(quote.total_ttc),
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

  const handleViewPdf = async ({ invoiceId, apiType }) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/quotes/${apiType}/${invoiceId}/pdf`, {
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

        const baseUrl = import.meta.env.VITE_API_URL || '';

        const fetchByType = async (apiType) => {
          const response = await fetch(`${baseUrl}/api/quotes/${apiType}?${params.toString()}`, {
            headers: { 'x-api-key': import.meta.env.VITE_API_KEY }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            return data.data.map(q => ({ ...q, _type: apiType }));
          }
          console.error('API response is not in expected format:', data);
          return [];
        };

        if (filters.type === 'tous') {
          const [garageQuotes, windowQuotes] = await Promise.all([
            fetchByType('garage'),
            fetchByType('window')
          ]);
          const merged = [...garageQuotes, ...windowQuotes].sort((a, b) => {
            const aTime = new Date(a.created_at).getTime();
            const bTime = new Date(b.created_at).getTime();
            return bTime - aTime;
          });
          setQuotes(merged);
          return;
        }

        const apiType = UI_TYPE_TO_API_TYPE[filters.type] || filters.type;
        const list = await fetchByType(apiType);
        setQuotes(list);
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
        <form className="filters-form">
          <div className="filter-item">
            <label htmlFor="type">Type de devis</label>
            <select id="type" name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="tous">Tous</option>
              <option value="garage">Portes de garage</option>
              <option value="fenetre">Fenêtres</option>
              <option value="sol">Sols</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="invoice_number">N° de devis</label>
            <input 
              id="invoice_number"
              type="text"
              name="invoice_number"
              value={filters.invoice_number}
              placeholder="Ex : DE123456"
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-item">
            <label htmlFor="client">Nom du client</label>
            <input 
              id="client"
              type="text"
              name="client"
              value={filters.client}
              placeholder="Ex : Martin"
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-item filter-item-range">
            <label>Période</label>
            <div className="input-range">
              <input 
                type="date" 
                name="dateDebut"
                value={filters.dateDebut}
                onChange={handleFilterChange}
                aria-label="Date de début"
              />
              <span>à</span>
              <input 
                type="date" 
                name="dateFin"
                value={filters.dateFin}
                onChange={handleFilterChange}
                aria-label="Date de fin"
              />
            </div>
          </div>

          <div className="filter-item filter-item-range">
            <label>Montant TTC</label>
            <div className="input-range">
              <input
                type="number"
                name="montantMin"
                value={filters.montantMin}
                placeholder="Min €"
                onChange={handleFilterChange}
                aria-label="Montant minimum"
              />
              <span>à</span>
              <input
                type="number"
                name="montantMax"
                value={filters.montantMax}
                placeholder="Max €"
                onChange={handleFilterChange}
                aria-label="Montant maximum"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button className="reset-btn" type="button" onClick={handleResetFilters}>Réinitialiser</button>
            <button className="export-btn" type="button" onClick={() => downloadCSV(quotes)}>
              Exporter en CSV
            </button>
          </div>
        </form>
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
                <td>{formatQuoteTypeLabel(quote._type)}</td>
                <td>{quote.client_name}</td>
                <td>{quote.client_address}</td>
                <td>{getQuoteProductLabel(quote)}</td>
                <td>{formatEur(quote.total_ttc)}</td>
                <td>
                  <span className={`status ${quote.status}`}>
                    {quote.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => handleViewPdf({ invoiceId: quote.id, apiType: quote._type || 'garage' })}
                  >
                    Voir
                  </button>
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
