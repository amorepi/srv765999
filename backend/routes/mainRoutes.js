const express = require('express');
const router = express.Router();
const path = require('path');
const { mdToHtml } = require('../mdToHtml');     // Nome file e funzione speculari
const { getLayoutHTML } = require('../layout');  // Layout centralizzato agnostico

// Route Principale: Serve l'interfaccia frontend statica
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

// Nuova rotta della feature: Converte e mostra lo stato di avanzamento delle note
router.get('/view-tags', async (req, res, next) => {
  try {
    // Esegue la conversione passando il parametro in modalità JSON
    const htmlContenuto = await mdToHtml({ filePath: './NEWTAGS.md' });
    
    // Inietta il risultato HTML dentro lo scheletro grafico del layout universale
    const paginaCompleta = getLayoutHTML({
      title: "Stato Avanzamento Lavori",
      content: htmlContenuto
    });
    
    res.send(paginaCompleta);
  } catch (err) {
    // Invia l'errore al middleware centralizzato 500 per non far crashare Express
    next(err);
  }
});

// Nuova Route: Converte e mostra l'elenco dei TODO e regole generali del progetto
router.get('/view-todo', async (req, res, next) => {
  try {
    // Legge ed elabora lo stesso file NEWTAGS.md (che ora contiene la lista TODO aggiornata)
    const htmlContenuto = await mdToHtml({ filePath: './NEWTAGS.md' });
    
    const paginaCompleta = getLayoutHTML({
        title: "Lista TODO & Linee Guida",
        content: htmlContenuto
    });
    
    res.send(paginaCompleta);
  } catch (err) {
    next(err); // Rimanda al middleware 500 in caso di problemi di lettura file
  }
});

module.exports = router;
