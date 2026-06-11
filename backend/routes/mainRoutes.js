import express from "express";
import { homepage } from "../homepage.js";
import { layout } from "../layout.js";
import { mailer } from "../utils/mailerUtils.js";
import { renderDashboard } from "../controllers/dashboardContr.js";

// Importazione dei router tematici atomici
import systemRoutes from "./systemRoutes.js";
import usersRoutes from "./usersRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

const parseUserSession = (req, res, next) => {
  req.currentUser = null;
  if (req.cookies && req.cookies.user_session) {
    try { req.currentUser = JSON.parse(req.cookies.user_session); } 
    catch (e) { console.error("[Sessione] Errore decodifica, pulizia:", e); res.clearCookie('user_session'); }
  }
  next();
};

// Aggancio globale del middleware di sessione a tutte le rotte successive
router.use(parseUserSession);

// Rotte primarie dell'interfaccia visiva
router.get('/', (req, res, next) => {
  try { return homepage({ req, res, version: req.app.get('version') || 'v1.0.00', user: req.currentUser || null }); } 
  catch (error) { next(error); }
});

router.get('/dashboard', (req, res) => {
  return renderDashboard({ req, res, version: req.app.get('version') || 'v1.0.00', user: req.currentUser || null });
});

// Innesto dei moduli di rotta isolati
router.use(systemRoutes);
router.use(usersRoutes);
router.use(authRoutes);

// Gestione errori 404
router.use((req, res) => {
  res.status(404).json({ success: false, error: "Risorsa non trovata", path: req.originalUrl });
});

// Gestione errori 500 con invio alert email
router.use(async (err, req, res, next) => {
  console.error("CRITICAL EXCEPTION:", err.stack);
  try {
    await mailer({
      subject: "ALLERTA CRITICA - Errore Interno del Server (500)",
      html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #dc3545; margin-bottom: 15px;">Rilevato Errore Interno (500)</h2>
        <p><strong>Rotta Richiesta:</strong> <code>${req.originalUrl}</code></p>
        <p><strong>Metodo HTTP:</strong> <span style="font-weight: bold;">${req.method}</span></p>
        <hr style="border: 0; border-top: 1px solid #dee2e6; margin: 20px 0;" />
        <pre style="background: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; color: #c53030; font-family: monospace;">${err.stack}</pre>
      </div>`
    });
  } catch (mailErr) { console.error("[server] Errore invio mail di allerta:", mailErr.message); }

  if (req.accepts('html')) {
    const content500 = `<div class="row justify-content-center mt-5"><div class="col-12 col-md-8 col-lg-6 text-center"><div class="p-5 bg-white border rounded shadow-sm">
      <h1 class="display-1 fw-bold text-danger">500</h1><h2 class="fw-bold text-dark mb-3">Servizio Momentaneamente Sovraccarico</h2>
      <p class="text-secondary mb-4">La squadra tecnica è già stata avvisata automaticamente. Ti invitiamo a riprovare tra qualche minuto.</p>
      <div class="d-flex gap-2 justify-content-center"><button onclick="window.location.reload();" class="btn btn-primary px-4">Aggiorna la Pagina</button><a href="/" class="btn btn-outline-secondary px-4">Torna alla Home</a></div>
    </div></div></div>`;
    return res.status(500).send(layout({ content: content500, user: req.currentUser, version: req.app.get('version') || 'v1.1.00' }));
  }
  return res.status(500).json({ success: false, error: "Errore interno del server" });
});

export const mainRoutes = router; 
