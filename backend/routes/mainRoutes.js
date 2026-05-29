const express = require('express');
const router = express.Router();
const path = require('path');
const { getLayoutHTML } = require('../layout');
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
    const paginaCompleta = getLayoutHTML({ title: "Stato Avanzamento Lavori", content: htmlContenuto });
    res.send(paginaCompleta);
  } catch (err) {
    next(err);
  }
});

// Route per visualizzare l'elenco dei TODO
router.get('/view-todo', async (req, res, next) => {
  try {
    const htmlContenuto = await mdToHtml({ filePath: './NEWTAGS.md' });
    const paginaCompleta = getLayoutHTML({ title: "Lista TODO & Linee Guida", content: htmlContenuto });
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
  const html404 = getLayoutHTML({
    title: "Pagina Non Trovata - 404",
    cssFile: "error.css",
    content: `
      <h1 class="error-title">Errore 404</h1>
      <p class="error-message">La risorsa richiesta <code>${req.originalUrl}</code> non è stata trovata.</p>
      <p><a href="/">&larr; Torna alla pagina principale</a></p>
    `
  });
  res.status(404).send(html404);
});

// Middleware per errore 500 - Errore interno del Server + Invio Mail Sincrono
router.use(async (err, req, res, next) => {
  console.error("CRITICAL EXCEPTION:", err.stack);
  
  try {
    await mailer({
      subject: "ALLERTA CRITICA - Errore Interno del Server (500)",
      text: `
        <h3>Rilevato Malfunzionamento Controllato</h3>
        <p><b>Data/Ora:</b> ${new Date().toLocaleString('it-IT')}</p>
        <p><b>Rotta interessata:</b> <code>${req.originalUrl}</code></p>
        <p><b>Metodo HTTP:</b> ${req.method}</p>
        <p><b>Indirizzo IP Richiedente:</b> ${req.ip}</p>
        <hr/>
        <pre style="background: #f8f9fa; padding: 10px; border: 1px solid #ccc;">${err.stack}</pre>
      `
    });
    console.log("[server] Mailer ha completato con successo la trasmissione SMTP.");
  } catch (mailErr) {
    console.error("[server] Errore reale intercettato durante il transito SMTP:", mailErr);
  }

  const html500 = getLayoutHTML({
    title: "Errore di Sistema - 500",
    cssFile: "error.css",
    content: `
      <h1 class="error-title">Errore Interno (500)</h1>
      <p class="error-message">Si è verificato un problema tecnico insolito durante l'elaborazione della richiesta.</p>
      <p>L'amministratore di sistema è stato notificato automaticamente via email.</p>
      <p><a href="/">&larr; Ritorna alla Home</a></p>
    `
  });
  res.status(500).send(html500);
});

module.exports = router;
