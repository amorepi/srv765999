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

module.exports = router;
