/**
 * Represents the data model for a Garage Quote.
 * This can be used for type hinting and creating new quote objects.
 */
class GarageQuote {
  /**
   * @param {object} [data={}] - The initial data for the quote.
   */
  constructor(data = {}) {
    // Backend-generated fields
    this.id = data.id || null;
    this.invoice_number = data.invoice_number || null;
    this.created_at = data.created_at || new Date().toISOString();
    this.status = data.status || 'pending';
    this.pdf_url = data.pdf_url || null;

    // Client Information
    this.client_code = data.client_code || '';
    this.client_name = data.client_name || '';
    this.client_address = data.client_address || '';
    this.client_city = data.client_city || '';

    // Delivery Information
    this.delivery_address = data.delivery_address || '';
    this.delivery_city = data.delivery_city || '';

    // Dates
    this.due_date = data.due_date || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString();

    // Technical Specifications
    this.technical_specs = data.technical_specs || {
      model: 'ankara', // 'ankara', 'castries', 'lima', 'riga'
      finish: 'ral_7016_dark', // 'ral_7016_dark', 'wood_flat', 'ral_9010_blanc'
      spring_system: 'front', // 'front', 'side' PAS ENCORE AJOUTER COTER BACK
      dimensions: {
        width: 0,
        height: 0,
        lintel_height: 0,
      },
      motorization: {
        type: 'manuelle', // 'manuelle', 'electrique'
        accessories: [], // 'telecommande', 'photocellule', 'clavier_code', 'bouton_poussoir' or 'serrure', 'poignee'
      },
    };

    // Products
    this.products = data.products || [
      {
        code: '',
        description: '',
        qty: 1,
        price_ht: 0,
      },
    ];

    // Payment
    this.payment_method = data.payment_method || 'Virement comptant';
    this.tva_number = data.tva_number || '';
    this.tva_rate = data.tva_rate || 20;
  }
}

export default GarageQuote;
