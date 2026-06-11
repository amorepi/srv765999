// File completo: backend/controllers/dashboardContr.js
import os                 from 'os';
import { execSync, exec } from 'child_process';
import util               from 'util';
import { layout }         from '../layout.js';

const execPromise = util.promisify(exec);

/**
 * Helper sicuro per eseguire comandi di sistema senza bloccare l'applicazione
 */
function safeExec(command, fallback = "N/D") {
  try {
    return execSync(command, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
  } catch (e) {
    return fallback;
  }
}

/**
 * Estrae la versione corrente di Nginx installata sul server
 */
function getNginxVersion() {
  const output = safeExec('nginx -v 2>&1', "Non installato");
  if (output === "Non installato") return output;
  const match = output.match(/\/(.+)/);
  return (match && match[1]) ? match[1].trim() : "N/D";
}

/**
 * Interroga in modo sicuro MongoDB usando il driver nativo già autenticato (Niente comandi Shell)
 */
async function getMongoData(req) {
  try {
    // Recuperiamo l'istanza del database centralizzata salvata nell'app Express
    const db = req.app.get('db');
    if (!db) {
      return { status: "Offline/Errore", version: "N/D", dbCount: "0", bgClass: "text-bg-danger" };
    }
    // 1. Interroghiamo il comando di buildInfo per estrarre la versione esatta del motore
    const adminDb = db.admin();
    const buildInfo = await adminDb.serverInfo();
    const mongoVersion = buildInfo.version || "N/D";
    // 2. Recuperiamo l'elenco reale dei database istanziati e attivi a cui l'utente ha accesso
    const dbListInfo = await adminDb.listDatabases();
    const activeDbsCount = dbListInfo.databases ? dbListInfo.databases.length : 0;
    return {
        status: "Operativo",
        version: mongoVersion,
        dbCount: activeDbsCount,
        bgClass: "text-bg-success"
    };
  } catch (e) {
    console.error("[Dashboard Error] Errore connessione DB nativa:", e.message);
    return { status: "Offline/Errore", version: "N/D", dbCount: "0", bgClass: "text-bg-danger" };
  }
}

/**
 * Genera il blocco HTML parametrizzato per una Card Metrica di sistema
 */
function renderMetricCard({ title, value, badgeText, badgeClass, isFullWidth }) {
  const colClass = isFullWidth ? "col-12" : "col-12 col-md-6";
  const bgClass = isFullWidth ? "bg-body-tertiary" : "bg-white";
  const valueFs = isFullWidth ? "fs-4 fw-bold" : "fs-5 fw-medium";

  return `
    <div class="${colClass}">
      <div class="card h-100 border shadow-sm ${bgClass}">
        <div class="card-body d-flex justify-content-between align-items-start">
          <div>
            <h6 class="card-subtitle mb-1 text-muted text-uppercase small fw-bold">${title}</h6>
            <p class="card-text ${valueFs} text-dark mb-0">${value}</p>
          </div>
          ${badgeText ? `<span class="badge ${badgeClass} font-monospace">${badgeText}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Genera il blocco HTML parametrizzato per un singolo pulsante Utility/Strumento
 */
function renderToolButton({ href, label }) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3">
      <div class="card border shadow-sm bg-white h-100">
        <div class="card-body d-flex align-items-center justify-content-start p-2">
          <a href="${href}" class="btn btn-primary px-4 fw-medium shadow-sm w-100 text-truncate">
            ${label}
          </a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Genera ed emette la pagina Dashboard protetta integrando le metriche di sistema
 */
export async function renderDashboard(context) {
  const { req, res, version, user } = context;

  if (!user) {
    return res.redirect('/login');
  }

  // 1. Raccolta e calcolo metriche hardware
  let diskSpace = safeExec("df -h / | tail -1 | awk '{print $4 \" liberi su \" $2}'", "Locale (macOS)");
  const totalGb = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
  const freeGb = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
  const isRamLow = parseFloat(freeGb) < 0.5;
  const ramBadgeClass = isRamLow ? "text-bg-danger" : "text-bg-success";

  // 2. Rilevazione versione OS
  let osVersion = safeExec('lsb_release -d', null);
  if (osVersion) {
    osVersion = osVersion.split(':')[1].trim();
  } else {
    osVersion = `${os.type()} ${os.release()} (Local)`;
  }

  // 3. Raccolta software e DB metrics
  const mongo = await getMongoData(req);
  const npmVersion = safeExec('npm -v', "N/D");
  const nginxVersion = getNginxVersion();

  // 4. Mappatura e composizione dinamica delle Card Metriche
  const metricsData = [
    { title: "Sistema operativo", value: osVersion },
    { title: "Node.js / npm", value: `${process.version} / v${npmVersion}` },
    { title: "Server Web Nginx", value: nginxVersion },
    { title: "RAM Disponibile", value: `${freeGb} GB / ${totalGb} GB`, badgeText: isRamLow ? 'Critica' : 'Ottimale', badgeClass: ramBadgeClass },
    { title: "Archiviazione Disco", value: diskSpace },
    { title: "Motore MongoDB", value: `${mongo.status} (${mongo.version})`, badgeText: mongo.status, badgeClass: mongo.bgClass },
    { title: "Database Istanziati attivi", value: `${mongo.dbCount} <span class="fs-6 fw-normal text-muted">unità logiche registrate</span>`, isFullWidth: true }
  ];
  const metricsHtml = metricsData.map(card => renderMetricCard(card)).join('');

  // 5. Mappatura e composizione dinamica della Sezione Tools Assistenza
  const toolsList = [
    { href: '/send-test-email', label: 'Invio email' },
    { href: '/health'         , label: 'Health Check' },
    { href: '/Structure'      , label: 'view-Structure' },
    { href: '/view-todo'      , label: 'view-todo' },
    { href: '/view-tags'      , label: 'view-tags' },
    { href: '/destroyAllUsers', label: 'destroyAllUsers' },
    { href: '/log-pm2'        , label: 'log-pm2' },
    { href: '/log-node'       , label: 'log-node' },
    { href: '/log-nginx'      , label: 'log-nginx' },
    { href: '/sim-400'        , label: 'Simula 400' },
    { href: '/sim-500'        , label: 'Simula 500' }
  ];
  const toolsHtml = toolsList.map(tool => renderToolButton(tool)).join('');

  // 6. Mappatura e composizione dinamica della Sezione Database Collections
  const collectionsList = [
    { href: '/allUsers', label: 'Users' }
  ];
  const collectionsHtml = collectionsList.map(coll => renderToolButton(coll)).join('');

  // 7. Costruzione globale del template unico
  const dashboardContent = `
    <div class="row justify-content-center mt-5">
      <div class="col-12 col-lg-10">
        
        <!-- Intestazione Pannello -->
        <div class="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
          <div>
            <h1 class="h2 fw-bold text-dark m-0">Informazioni generali</h1>
            <p class="text-muted small m-0 mt-1">Stato operativo dell'infrastruttura</p>
          </div>
          <span class="badge bg-dark-subtle text-dark-emphasis p-2 font-monospace">Versione App: ${version}</span>
        </div>

        <!-- Gruppo 1: Griglia delle Card Metriche Hardware/Software -->
        <div class="row g-3">
          ${metricsHtml}
        </div>

        <!-- Gruppo 2: Sezione TOOLS Assistenza (A 4 colonne responsive) -->
        <div class="mt-5">
          <h4 class="fw-bold text-dark border-bottom pb-2 mb-2 fs-5">Sezione TOOLS Assistenza</h4>
          <div class="row g-2">
            ${toolsHtml}
          </div>
        </div>

        <!-- Gruppo 3: Sezione Database Collections -->
        <div class="mt-5 mb-5">
          <h4 class="fw-bold text-dark border-bottom pb-2 mb-2 fs-5">Sezione Database Collections</h4>
          <div class="row g-2">
            ${collectionsHtml}
          </div>
        </div>

      </div>
    </div>
  `;

  return res.send(layout({ content: dashboardContent, user: user, version: version }));
}
