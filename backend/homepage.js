const { layout } = require('./layout');

/**
 * Genera l'HTML dinamico per la Home Page inserendolo nel layout universale.
 * @param {Object} params - Oggetto JSON unico contenente i parametri di configurazione.
 * @param {Object} [params.user] - Oggetto JSON facoltativo con i dati dell'utente loggato.
 * @returns {string} Pagina HTML completa.
 */
function homepage(params) {
  const currentProject = process.env.PROJECT || 'Applicazione';
  const user = params ? params.user : null;

  const htmlContent = `
    <div style="text-align: center; margin-top: 50px;">
      <h1>Benvenuto su ${currentProject}</h1>
      <p style="color: #6c757d; margin-top: 15px;">Usa i percorsi di test per simulare la visualizzazione:</p>
      <div style="margin-top: 20px; gap: 12px; display: flex; justify-content: center;">
        <a href="/test-login-admin" style="text-decoration:none; color:#212529; background:#e9ecef; padding:8px 16px; border-radius:4px; font-weight:500;">Simula Login Admin (Due Iniziali)</a>
        <a href="/test-login-user" style="text-decoration:none; color:#212529; background:#e9ecef; padding:8px 16px; border-radius:4px; font-weight:500;">Simula Login User (Foto)</a>
      </div>
    </div>
  `;

  return layout({
    title: "Home Page",
    content: htmlContent,
    user: user
  });
}

module.exports = { homepage };
