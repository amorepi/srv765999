const express = require('express');
const router = express.Router();
const path = require('path');
const { layout } = require('../layout');
const { mailer } = require('../mailer');
const { mdToHtml } = require('../mdToHtml');

// Route Principale: Serve l'interfaccia frontend statica
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

// Route per visualizzare le note di rilascio
router.get('/view-tags', async (req, res, next) => {
  try {
    const htmlContenuto = await mdToHtml({ filePath: './NEWTAGS.md' });
    const paginaCompleta = layout({ title: "Stato Avanzamento Lavori", content: htmlContenuto });
    res.send(paginaCompleta);
  } catch (err) {
    next(err);
  }
});

// Route per visualizzare l'elenco dei TODO
router.get('/view-todo', async (req, res, next) => {
  try {
    const htmlContenuto = await mdToHtml({ filePath: './NEWTAGS.md' });
    const paginaCompleta = layout({ title: "Lista TODO & Linee Guida", content: htmlContenuto });
    res.send(paginaCompleta);
  } catch (err) {
    next(err);
  }
});

// Rotta test Errore (Genera un crash controllato per provare il mailer)
router.get('/error-test', (req, res) => {
  throw new Error("Test di malfunzionamento controllato per la feature/mailer");
});

// ======================================================================
// --- GESTIONE ERRORI CENTRALIZZATA (IN CODA AL ROUTER) ---
// ======================================================================

// Middleware per errore 404 - Risorsa non trovata
router.use((req, res, next) => {
  const html404 = layout({
    title: "Pagina Non Trovata - 404",
    content: `
        <div class="error-card">
            <h1 class="error-title">Errore 404</h1>
            <p class="error-message">La risorsa richiesta <code>${req.originalUrl}</code> non è stata trovata.</p>
            <p><a href="/">&larr; Torna alla pagina principale</a></p>
        </div>
    `
  });
  res.status(404).send(html404);
});

// Middleware per errore 500 - Errore interno del Server
router.use(async (err, req, res, next) => {
  console.error("CRITICAL EXCEPTION:", err.stack);
  
  try {
    await mailer({
      subject: "ALLERTA CRITICA - Errore Interno del Server (500)",
      text: `<p>Rotta: ${req.originalUrl}</p><pre>${err.stack}</pre>`
    });
  } catch (mailErr) {
    console.error("[server] Errore mailer:", mailErr);
  }

  const html500 = layout({
    title: "Errore di Sistema - 500",
    content: `
        <div class="error-card">
            <h1 class="error-title">Errore Interno (500)</h1>
            <p class="error-message">Si è verificato un problema tecnico insolito durante l'elaborazione.</p>
            <p><a href="/">&larr; Ritorna alla Home</a></p>
        </div>
    `
  });
  res.status(500).send(html500);
});

module.exports = router;
