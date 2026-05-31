const express = require('express');
const router = express.Router();
const path = require('path');
const { layout } = require('../layout');
const { homepage } = require('../homepage');
const { mailer } = require('../mailer');
const { mdToHtml } = require('../mdToHtml');

// --- SIMULAZIONE STATO UTENTE (Temporaneo per feature/homepage) ---
let utenteSimulato = null; 

// Route Principale dinamica: non serve più file statici
router.get('/', (req, res) => {
  const paginaCompleta = homepage({ user: utenteSimulato });
  res.send(paginaCompleta);
});

// Rotte temporanee per simulare i criteri grafici richiesti
router.get('/test-login-admin', (req, res) => {
  utenteSimulato = { name: "Piero", lastName: "Amore", fullName: "Piero Amore", role: "admin", avatarUrl: "" };
  res.redirect('/');
});

router.get('/test-login-user', (req, res) => {
  utenteSimulato = { name: "Pietro", lastName: "Amore", fullName: "Piero Amore", role: "user", avatarUrl: "/uploads/users/AmorePietro.jpg" };
  res.redirect('/');
});

router.get('/test-logout', (req, res) => {
  utenteSimulato = null;
  res.redirect('/');
});

router.get('/view-tags', async (req, res, next) => {
  try {
    const htmlContenuto = await mdToHtml({ filePath: './NEWTAGS.md' });
    const paginaCompleta = layout({ title: "Stato Avanzamento Lavori", content: htmlContenuto, user: utenteSimulato });
    res.send(paginaCompleta);
  } catch (err) {
    next(err);
  }
});

router.get('/view-todo', async (req, res, next) => {
  try {
    const htmlContenuto = await mdToHtml({ filePath: './NEWTAGS.md' });
    const paginaCompleta = layout({ title: "Lista TODO & Linee Guida", content: htmlContenuto, user: utenteSimulato });
    res.send(paginaCompleta);
  } catch (err) {
    next(err);
  }
});

router.get('/error-test', (req, res) => {
  throw new Error("Test di malfunzionamento controllato per la feature/mailer");
});

// --- GESTIONE ERRORI CENTRALIZZATA IN CODA ---
router.use((req, res, next) => {
  const html404 = layout({
    title: "Pagina Non Trovata - 404",
    user: utenteSimulato,
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
    user: utenteSimulato,
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
