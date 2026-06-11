// File completo e allineato: backend/controllers/toolsContr.js
import fs           from 'node:fs';
import os           from 'node:os';
import path         from 'node:path';
import { layout }   from "../layout.js";
import { mailer }   from "../utils/mailerUtils.js";
import { mdToHtml } from "../utils/mdToHtml.js";

/**
 * Scansiona ricorsivamente le directory in formato testo grafico
 */
function buildTree(dirPath, prefix = "") {
  let output = "";
  try {
    const files = fs.readdirSync(dirPath);
    const filteredFiles = files.filter(f => !['node_modules', '.git', '.gitignore', '.DS_Store', '.env', 'modified.sh', 'modified.txt'].includes(f));
    
    filteredFiles.forEach((file, index) => {
      const fullPath = path.join(dirPath, file);
      const isLast = index === filteredFiles.length - 1;
      const marker = isLast ? "└── " : "├── ";
      
      output += `${prefix}${marker}${file}\n`;
      
      if (fs.statSync(fullPath).isDirectory()) {
        const newPrefix = prefix + (isLast ? "    " : "│   ");
        output += buildTree(fullPath, newPrefix);
      }
    });
  } catch (err) {
    output += `${prefix} [Errore di lettura directory]\n`;
  }
  return output;
}

/**
 * Helper privato per renderizzare una pagina di documentazione standard nel layout
 */
async function renderMarkdownPage(req, res, next, { filePath, title, subtitle }) {
  try {
    const currentVersion = req.app.get('version') || 'v1.1.00';
    // Recupero rigoroso della sessione utente per mantenere attivo l'Avatar nell'Header
    let currentUser = null;
    if (req.cookies && req.cookies.user_session) {
      currentUser = JSON.parse(req.cookies.user_session);
    }
    const htmlContent = await mdToHtml({ filePath });
    const viewContent = `
      <div class="row justify-content-center mt-5">
        <div class="col-12 col-lg-10">
          <div class="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <div>
              <h1 class="h2 fw-bold text-dark m-0">${title}</h1>
              <p class="text-muted small m-0 mt-1">${subtitle}</p>
            </div>
            <a href="/dashboard" class="btn btn-sm btn-secondary px-3">Torna al Pannello</a>
          </div>
          <div class="card border shadow-sm p-4 bg-white text-dark markdown-body">
            ${htmlContent || '<div class="text-muted italic">Nessun contenuto disponibile nel file selezionato.</div>'}
          </div>
        </div>
      </div>
    `;
    return res.send(layout({ content: viewContent, user: currentUser, version: currentVersion }));
  } catch (error) {
    next(error);
  }
}

/**
 * Utility: /view-todo (Mostra le attività correnti e didattiche da NEWTAGS.md)
 */
export async function viewTodo(req, res, next) {
  return renderMarkdownPage(req, res, next, {
    filePath: './NEWTAGS.md',
    title: 'Lista TODO',
    subtitle: 'Pianificazione dello sviluppo, middleware e regole generalie del progetto'
  });
}

/**
 * Utility: /view-tags (Mostra lo storico delle release reali da CHANGELOG.md)
 */
export async function viewTags(req, res, next) {
  return renderMarkdownPage(req, res, next, {
    filePath: './CHANGELOG.md',
    title: 'Registro Storico Rilasci (Changelog)',
    subtitle: 'Revisione dei tag di produzione e cache bursting applicativo'
  });
}

/**
 * Utility: /Structure
 */
export async function viewStructure(req, res, next) {
  try {
    const currentVersion = req.app.get('version') || 'v1.1.00';
    
    let currentUser = null;
    if (req.cookies && req.cookies.user_session) {
      currentUser = JSON.parse(req.cookies.user_session);
    }

    const currentDirectory = process.cwd();
    const currentProject = process.env.PROJECT || path.basename(currentDirectory);
    const treeOutput = `${currentProject}/\n${buildTree(currentDirectory)}`;

    const viewContent = `
      <div class="row justify-content-center mt-5">
        <div class="col-12 col-lg-10">
          
          <div class="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <div>
              <h1 class="h2 fw-bold text-dark m-0">Struttura Albero Progetto</h1>
              <p class="text-muted small m-0 mt-1">Mappa in tempo reale dei file e delle directory</p>
            </div>
            <a href="/dashboard" class="btn btn-sm btn-secondary px-3">Torna al Pannello</a>
          </div>

          <div class="card border-0 shadow-sm overflow-hidden">
            <div class="card-header bg-dark text-white-50 d-flex align-items-center py-2 px-3">
              <div class="d-flex gap-1 me-3">
                <span class="bg-danger rounded-circle d-inline-block" style="width:10px; height:10px;"></span>
                <span class="bg-warning rounded-circle d-inline-block" style="width:10px; height:10px;"></span>
                <span class="bg-success rounded-circle d-inline-block" style="width:10px; height:10px;"></span>
              </div>
              <span class="small font-monospace text-light">terminale@${process.env.PROJECT}: ~ tree</span>
            </div>
            <div class="card-body bg-dark text-success p-3">
              <pre class="mb-0 font-monospace" style="white-space: pre-wrap; font-size: 0.85rem; line-height: 1.4;"><code>${treeOutput}</code></pre>
            </div>
          </div>

        </div>
      </div>
    `;

    return res.send(layout({ content: viewContent, user: currentUser, version: currentVersion }));
  } catch (error) {
    next(error);
  }
}

/**
 * Utility: /destroyAllUsers (GET)
 * Mostra il form grafico di conferma con richiesta credenziali prima di cancellare
 */
export async function showDestroyForm(req, res, next) {
  try {
    const currentVersion = req.app.get('version') || 'v1.1.00';
    
    let currentUser = null;
    if (req.cookies && req.cookies.user_session) {
      currentUser = JSON.parse(req.cookies.user_session);
    }

    const destroyFormContent = `
      <div class="row justify-content-center mt-5">
        <div class="col-12 col-md-8 col-lg-6">
          
          <div class="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <div>
              <h1 class="h2 fw-bold text-danger m-0">Inizializzazione Collezione</h1>
              <p class="text-muted small m-0 mt-1">Procedura irreversibile di tabula rasa degli utenti</p>
            </div>
            <a href="/dashboard" class="btn btn-sm btn-secondary px-3">Annulla</a>
          </div>

          <div class="card border-danger shadow-sm p-4 bg-white">
            <div class="alert alert-danger border-0 mb-4" role="alert">
              <h5 class="alert-heading fw-bold">⚠️ ATTENZIONE ATTENZIONE!</h5>
              <p class="mb-0 small">Questa azione cancellerà permanentemente l'intera collezione <strong>users</strong> da MongoDB, compresi tutti i vecchi indici associati.</p>
            </div>

            <form action="/destroyAllUsers" method="POST">
              <div class="mb-3">
                <label class="form-label small fw-bold text-dark">Conferma Username Amministratore</label>
                <input type="text" name="confirm_user" class="form-control" required placeholder="Inserisci username amministratore">
              </div>

              <div class="mb-4">
                <label class="form-label small fw-bold text-dark">Conferma Password di Sicurezza</label>
                <input type="password" name="confirm_pass" class="form-control" required placeholder="Inserisci password di sicurezza">
              </div>

              <div class="d-flex gap-2 justify-content-end border-top pt-3">
                <a href="/dashboard" class="btn btn-outline-secondary px-4">Annulla ed Esci</a>
                <button type="submit" class="btn btn-danger px-4 fw-medium">Procedi con la Tabula Rasa</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    `;

    return res.send(layout({ content: destroyFormContent, user: currentUser, version: currentVersion }));
  } catch (error) {
    next(error);
  }
}

/**
 * Utility: /destroyAllUsers (POST)
 * Valida le credenziali e azzera fisicamente la collezione su MongoDB
 */
export async function confirmDestroyAll(req, res, next) {
  try {
    const { confirm_user, confirm_pass } = req.body;

    // Verifica rigida delle stesse credenziali di accesso al pannello
    if (confirm_user === 'admin' && confirm_pass === process.env.ADMIN_PASS) {
      const db = req.app.get('db');
      
      // Cancella la collezione gestendo l'eventualità che sia già vuota o assente
      await db.collection('users').drop().catch(() => {});
      
      console.log("[MANUTENZIONE] Tabula rasa della collezione users eseguita con successo.");
      
      // Restituisce una notifica via script e rimanda alla dashboard pulita
      return res.send('<script>alert("Tabula rasa completata con successo! La collezione è stata azzerata."); window.location.href="/dashboard";</script>');
    }

    // Se le credenziali di conferma sono errate blocca l'operazione
    return res.send('<script>alert("Credenziali di sicurezza errate! Operazione annullata."); window.location.href="/destroyAllUsers";</script>');
  } catch (error) {
    next(error);
  }
}

/**
 * Utility: /sim-400
 * Simula un errore lato client (Bad Request) renderizzato nel layout del sito
 */
export function sim400(req, res) {
  const currentVersion = req.app.get('version') || 'v1.1.00';
  let currentUser = null;
  if (req.cookies && req.cookies.user_session) {
    currentUser = JSON.parse(req.cookies.user_session);
  }

  const content400 = `
    <div class="row justify-content-center mt-5">
      <div class="col-12 col-md-8 col-lg-6 text-center">
        <div class="p-5 bg-white border rounded shadow-sm">
          <h1 class="display-1 fw-bold text-warning">400</h1>
          <h2 class="fw-bold text-dark mb-3">Richiesta Malformata (Bad Request)</h2>
          <p class="text-secondary mb-4">Il server non ha potuto comprendere la richiesta a causa di una sintassi non valida lato client.</p>
          <a href="/dashboard" class="btn btn-primary px-4">Torna alla Dashboard</a>
        </div>
      </div>
    </div>
  `;
  return res.status(400).send(layout({ content: content400, user: currentUser, version: currentVersion }));
}

/**
 * Utility: /sim-500
 * Forza un'eccezione interna del server per simulare e testare l'allerta mailer (Internal Server Error)
 */
export function sim500(req, res, next) {
  // Genera intenzionalmente un errore di riferimento a variabile inesistente
  try {
    const triggerCrash = variabileInesistenteNelSistema * 2;
  } catch (err) {
    // Personalizziamo il messaggio per renderlo riconoscibile nei log
    err.message = "SIMULAZIONE 500 - Eccezione controllata dal Pannello Tools Assistenza";
    next(err);
  }
}

/**
 * Utility: /send-test-email
 * Invia una mail di benvenuto formattata in stile Bootstrap per verificare l'SMTP
 */
export async function sendTestEmail(req, res, next) {
  try {
    const currentProject = process.env.PROJECT;
    
    // Struttura HTML del messaggio di benvenuto con stile Bootstrap inline
    const emailHtmlBody = `
      <div style="font-family: sans-serif; background-color: #f8f9fa; padding: 40px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 30px; border-top: 4px solid #0d6efd; text-align: left;">
          <h1 style="color: #212529; font-size: 24px; margin-bottom: 15px; font-weight: bold; text-align: center;">Benvenuto su ${currentProject}</h1>
          <p style="color: #6c757d; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
            Questo è un messaggio automatico di test generato dal Pannello Tools Assistenza. 
            Se stai leggendo questa mail, il motore backend ES Modules e la configurazione del mailer SMTP sono operativi al 100%.
          </p>
          <div style="background-color: #e9ecef; padding: 12px; border-radius: 4px; font-family: monospace; font-size: 14px; color: #495057; margin-bottom: 25px; text-align: center;">
            Stato: Connessione SMTP Verificata con Successo
          </div>
          <p style="color: #a0a0a0; font-size: 12px; margin-top: 30px; border-top: 1px solid #dee2e6; padding-top: 15px; text-align: center;">
            Infrastruttura ${currentProject} &copy; 2026 - Scope ESM Privato
          </p>
        </div>
      </div>
    `;

    // Eseguiamo l'invio sfruttando i parametri ambientali .env del mailer.js
    await mailer({
      subject: `[${currentProject}] - Verifica Connettività Mailer Completata`,
      html: emailHtmlBody
    });

    console.log("[MANUTENZIONE] Email di test inviata con successo via SMTP.");
    return res.send('<script>alert("Email di test inviata con successo! Controlla la tua casella postale."); window.location.href="/dashboard";</script>');
  } catch (error) {
    console.error("[MANUTENZIONE ERRORE]: Invio mail fallito:", error.message);
    return res.send(`<script>alert("Impossibile inviare la mail. Errore SMTP: ${error.message}"); window.location.href="/dashboard";</script>`);
  }
}

/**
 * Helper privato per leggere un file di log da disco e formattarlo nel terminale grafico
 */
function renderLogTerminal(req, res, { logPath, title, subtitle }) {
  const currentVersion = req.app.get('version') || 'v1.1.00';
  let currentUser = null;
  if (req.cookies && req.cookies.user_session) {
    currentUser = JSON.parse(req.cookies.user_session);
  }

  let logOutput = "";
  try {
    // Controllo specifico per Nginx in ambiente locale Mac
    if (title.includes("Nginx") && os.platform() === 'darwin' && (!logPath || !fs.existsSync(logPath))) {
      logOutput = `[INFO INFRASTRUTTURA]: Server Web Nginx non rilevato in ambiente locale (macOS).\nL'analisi di questo registro non è di competenza su questo ambiente di sviluppo.\n\nIl monitoraggio attivo dell'inversione proxy sarà operativo al 100% sul server di produzione Linux.`;
    } 
    // Controllo standard di esistenza per gli altri log
    else if (logPath && fs.existsSync(logPath)) {
      const fullLog = fs.readFileSync(logPath, 'utf-8');
      const lines = fullLog.trim().split('\n');
      logOutput = lines.slice(-50).join('\n');
    } 
    else {
      logOutput = `[AVVISO DI SISTEMA]: Il file di log non esiste al percorso configurato:\n${logPath}\n\nAssicurati che il percorso nel file .env sia corretto o che il servizio abbia generato i primi output.`;
    }
  } catch (err) {
    logOutput = `[ERRORE CRITICO]: Impossibile accedere al file di log.\nDettagli: ${err.message}`;
  }

  const viewContent = `
    <div class="row justify-content-center mt-5">
      <div class="col-12 col-lg-10">
        
        <!-- Intestazione -->
        <div class="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
          <div>
            <h1 class="h2 fw-bold text-dark m-0">${title}</h1>
            <p class="text-muted small m-0 mt-1">${subtitle}</p>
          </div>
          <div class="d-flex gap-2">
            <button onclick="window.location.reload();" class="btn btn-sm btn-outline-primary px-3">Aggiorna Log</button>
            <a href="/dashboard" class="btn btn-sm btn-secondary px-3">Torna al Pannello</a>
          </div>
        </div>

        <!-- Finestra Terminale Scuro per i Log -->
        <div class="card border-0 shadow-sm overflow-hidden">
          <div class="card-header bg-dark text-white-50 d-flex align-items-center py-2 px-3">
            <div class="d-flex gap-1 me-3">
              <span class="bg-danger rounded-circle d-inline-block" style="width:10px; height:10px;"></span>
              <span class="bg-warning rounded-circle d-inline-block" style="width:10px; height:10px;"></span>
              <span class="bg-success rounded-circle d-inline-block" style="width:10px; height:10px;"></span>
            </div>
            <span class="small font-monospace text-light">visualizzatore@${process.env.PROJECT}: ~ tail -n 50</span>
          </div>
          <div class="card-body bg-dark text-white p-3" style="background-color: #1e1e1e !important;">
            <pre class="mb-0 font-monospace text-start" style="white-space: pre-wrap; font-size: 0.8rem; line-height: 1.5; color: #f8f8f2;"><code class="text-light">${logOutput}</code></pre>
          </div>
        </div>

      </div>
    </div>
  `;

  return res.send(layout({ content: viewContent, user: currentUser, version: currentVersion }));
}

/**
 * Utility: /log-pm2
 */
export function logPm2(req, res) {
  return renderLogTerminal(req, res, {
    logPath: process.env.LOG_PATH_PM2,
    title: "Console Log PM2",
    subtitle: "Analisi dell'output di processo gestito dal daemon PM2"
  });
}

/**
 * Utility: /log-node
 */
export function logNode(req, res) {
  return renderLogTerminal(req, res, {
    logPath: process.env.LOG_PATH_NODE,
    title: "Console Log Node.js",
    subtitle: "Registro degli eventi e dei log applicativi diretti dello scope ESM"
  });
}

/**
 * Utility: /log-nginx
 */
export function logNginx(req, res) {
  return renderLogTerminal(req, res, {
    logPath: process.env.LOG_PATH_NGINX,
    title: "Console Log Nginx",
    subtitle: "Registro degli errori e dei passaggi catturati dal proxy inverso"
  });
}
