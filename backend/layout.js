/**
 * Genera la struttura agnostica del Layout Top-Fixed a tre colonne geometriche
 * Agganciato al 100% con le classi native di produzione di Bootstrap v5.3
 * @param {Object} context - Parametro unico in modalità oggetto JSON
 * @param {string} context.content - Il contenuto HTML dinamico da iniettare nella colonna centrale
 * @param {Object} context.user - Dati dell'utente connesso per l'avatar e le info di profilo
 * @param {string} context.version - Stringa della versione ereditata centralmente
 * @returns {string} Stringa HTML completa del layout pronto per il rendering
 */
export function layout(context) {
  const { content, user, version } = context;
  
  // 1. Costruzione dinamica dei percorsi prependendo /img/ ai valori del file .env
  const envLogo = process.env.LOGO_PROJ;
  const logoUrl = envLogo ? `/img/${envLogo}` : '/img/logo_proj.png';
  
  let avatarUrl = '/img/avatar_proj.png';
  if (user && user.avatar) {
    avatarUrl = user.avatar; // Se l'utente ha un avatar specifico (magari un URL completo o personalizzato)
  } else if (process.env.AVATAR_PROJ) {
    avatarUrl = `/img/${process.env.AVATAR_PROJ}`; // Fallback sul file definito nel .env
  }
  
  const userName = (user && user.name) ? user.name : 'Amministratore';
  const displayVersion = version || 'v1.1.00';

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Progetto ${process.env.PROJECT}</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
</head>
<body class="bg-light">
  
  <!-- HEADER FIXED TOP A TRE COLONNE DISTINTE (BOOTSTRAP 5.3) -->
  <header class="navbar fixed-top bg-white border-bottom shadow-sm py-2">
    <div class="container-fluid d-flex align-items-center justify-content-between">
      
      <!-- Colonna Sinistra: Logo e Navigazione Dinamica -->
      <div class="d-flex align-items-center gap-3">
        <a href="/" class="navbar-brand m-0 p-0">
          <img src="${logoUrl}" alt="Logo" class="d-inline-block align-text-top">
        </a>
        <a href="/" class="nav-link text-dark fw-medium">Home</a>
        ${user ? `<a href="/dashboard" class="nav-link text-dark fw-medium">Dashboard</a>` : ''}
      </div>

      <!-- Colonna Centrale: Versione -->
      <div class="text-center">
        <span class="badge text-bg-secondary font-monospace px-2 py-1">${displayVersion}</span>
      </div>
      
      <!-- Colonna Destra: Stato Utente Dinamico (Anonimo / Loggato) -->
      <div class="d-flex align-items-center gap-3">
        ${user ? `
          <!-- Se l'utente è loggato: mostra Avatar e Esci -->
          <div class="position-relative" title="${userName}" style="width: 36px; height: 36px;">
            <img src="${avatarUrl}" alt="User Avatar" class="img-fluid rounded-circle border w-100 h-100 object-fit-cover">
          </div>
          <a href="/logout" class="btn btn-outline-danger btn-sm px-3">Esci</a>
        ` : `
          <!-- Se l'utente è anonimo: mostra solo Accedi -->
          <a href="/login" class="btn btn-primary btn-sm px-3">Accedi</a>
        `}
      </div>

    </div>
  </header>

  <!-- CORPO CENTRALE LIBERO E RESPONSIVE (Distanziato dall'header fisso tramite pt-5) -->
  <main class="container-fluid pt-5">
    ${content || '<div class="text-center text-muted my-5">Nessun contenuto disponibile</div>'}
  </main>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>
  `;
}
