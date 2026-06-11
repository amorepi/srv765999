// File completo: backend/homepage.js
import { layout } from "./layout.js";

/**
 * Gestisce lo stato e genera l'HTML dinamico per la Home Page / Dashboard
 * @param {Object} context - Parametro unico in modalità oggetto JSON
 * @param {Object} context.req - Oggetto Express Request
 * @param {Object} context.res - Oggetto Express Response
 * @param {string} context.version - Stringa della versione ereditata centralmente
 * @param {Object} [context.user] - Dati facoltativi dell'utente loggato
 */
export async function homepage(context) {
  const { req, res, version, user } = context;
  
  const currentProject = process.env.PROJECT;
  
  // Contenuto HTML strutturato con la griglia e le utility responsive di Bootstrap
  const htmlContent = `
    <div class="row justify-content-center mt-5">
      <div class="col-12 col-md-8 col-lg-6 text-center">
        
        <h1 class="display-5 fw-bold text-dark mb-3">Benvenuto su ${currentProject}</h1>
        
        <p class="lead text-secondary mb-4">
          Il motore backend ES Modules e il database sono pronti e connessi.
        </p>
        
        <p class="small text-muted">
          Endpoint di gestione utenti configurato su 
          <code class="bg-body-secondary text-dark px-2 py-1 rounded border font-monospace">/api/users</code>
        </p>

      </div>
    </div>
  `;

  // Genera l'HTML completo inserendo i dati nel layout a tre colonne
  const fullHtml = layout({
    content: htmlContent,
    user: user,
    version: version
  });

  // Risposta sincrona al browser per completare la richiesta HTTP
  return res.send(fullHtml);
}
