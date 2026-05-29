const fs = require('fs').promises;
const { marked } = require('marked');

/**
 * Legge un file Markdown e lo converte in una stringa HTML.
 * @param {Object} params - Oggetto JSON contenente i parametri.
 * @param {string} params.filePath - Il percorso del file .md da convertire.
 * @returns {Promise<string>} Il contenuto convertito in codice HTML.
 */
async function mdToHtml(params) {
  // Validazione rigorosa del parametro JSON unico
  if (!params || !params.filePath) {
    throw new Error("Parametro 'filePath' mancante nell'oggetto JSON.");
  }

  try {
    // Lettura asincrona del file
    const mdContent = await fs.readFile(params.filePath, 'utf-8');
    
    // Conversione da Markdown a HTML puro tramite la libreria 'marked'
    const htmlContent = marked.parse(mdContent);
    
    return htmlContent;
  } catch (error) {
    console.error(`[mdToHtml] Errore di lettura/conversione per il file: ${params.filePath}`, error);
    throw error;
  }
}

module.exports = { mdToHtml };
