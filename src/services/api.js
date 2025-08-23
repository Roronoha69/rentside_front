import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const saveGarageQuotePDF = async (quoteData) => {
  try {
    // Création du devis
    const response = await api.post('/garage-quotes', quoteData);
    const { invoice_number } = response.data.data;

    // Génération du PDF
    const pdfResponse = await api.get(`/garage-quotes/${invoice_number}/pdf`, {
      responseType: 'blob'
    });

    // Création du lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `devis-${invoice_number}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true, invoice_number };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du PDF:', error);
    throw error;
  }
};
