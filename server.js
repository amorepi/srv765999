require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { getLayoutHTML } = require('./backend/layout');
const mainRoutes = require('./backend/routes/mainRoutes');

const app = express();

// --- MIDDLEWARE GLOBALI ---
// Nota: Gestiscono i dati in ingresso prima che raggiungano le rotte.
app.use(express.json()); // Converte i body delle richieste in oggetti JSON
app.use(express.urlencoded({ extended: true })); // Gestisce i dati inviati da form HTML tradizionali
app.use(cookieParser()); // Legge i cookie (necessario per il cookie 'auth_token' in mainRoutes)

// Servizio file statici (CSS, JS, immagini)
app.use(express.static(path.join(__dirname, 'public')));

// --- INTEGRAZIONE ROTTE ---
app.use('/', mainRoutes);

// Middleware per errore 404 - Risorsa non trovata
app.use((req, res, next) => {
  const html404 = getLayoutHTML({
    title: "Pagina Non Trovata - 404",
    cssFile: "error.css", // Sostituisce dinamicamente il CSS standard con quello degli errori
    content: `
        <h1 class="error-title">Errore 404</h1>
        <p class="error-message">La risorsa richiesta <code>${req.originalUrl}</code> non è stata trovata.</p>
        <p><a href="/">&larr; Torna alla pagina principale</a></p>
    `
  });
  res.status(404).send(html404);
});

// Middleware per errore 500 - Errore interno del server
app.use((err, req, res, next) => {
  console.error("CRITICAL EXCEPTION:", err.stack);
  
  const html500 = getLayoutHTML({
    title: "Errore di Sistema - 500",
    cssFile: "error.css", // Usa lo stile dedicato agli errori
    content: `
      <h1 class="error-title">Errore Interno (500)</h1>
      <p class="error-message">Si è verificato un problema tecnico durante l'elaborazione della richiesta.</p>
      <p><a href="/">&larr; Ritorna alla Home</a></p>
    `
  });
  res.status(500).send(html500);
});

// --- AVVIO SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server operativo su porta ${PORT}`));
