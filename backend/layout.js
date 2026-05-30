/**
 * Genera il layout HTML standard a tre colonne (Top e Footer) in modo agnostico.
 * @param {Object} params - Oggetto JSON unico contenente i parametri di rendering.
 * @param {string} params.title - Il titolo della pagina (tag <title>).
 * @param {string} params.content - Il contenuto HTML dinamico da inserire nel corpo centrale.
 * @param {string} [params.cssFile="styles.css"] - Il file CSS da caricare.
 * @param {Object} [params.user] - Oggetto JSON facoltativo con i dati dell'utente loggato.
 * @returns {string} Pagina HTML completa.
 */
function layout(params) {
  const title = params.title || "Applicazione";
  const content = params.content || "<p>Nessun contenuto disponibile.</p>";
  const cssFile = params.cssFile || "styles.css";
  
  const currentProject = process.env.PROJECT || "Applicazione";
  const appVersion = process.env.npm_package_version || "1.0.06";

  // Gestione dinamica dei Link di navigazione richiesti
  const navLinksHTML = params.user 
    ? `<a href="/">Home</a><a href="/dashboard">Dashboard</a>`
    : `<a href="/">Home</a>`;

    // Gestione dinamica della colonna destra (Pulsante Accedi o Blocco Avatar + Esci nativo)
  let userAvatarHTML = `<div class="nav-user"><a href="/login" class="btn-login">Accedi</a></div>`;
  
  if (params.user) {
    const nameToShow = params.user.fullName || `${params.user.name || ''} ${params.user.lastName || ''}`.trim() || "Utente";
    
    // 1. Estrae la prima lettera del Nome
    const firstInitial = (params.user.name || "U").charAt(0).toUpperCase();
    
    // 2. Cerca il cognome in params.user.lastName o tenta di estrarlo da fullName
    let lastInitial = "";
    if (params.user.lastName) {
      lastInitial = params.user.lastName.charAt(0).toUpperCase();
    } else if (params.user.fullName) {
      // Se c'è un fullName (es. "Piero Amore"), prende la prima lettera dopo lo spazio
      const parti = params.user.fullName.trim().split(/\s+/);
      if (parti.length > 1) {
        lastInitial = parti[parti.length - 1].charAt(0).toUpperCase();
      }
    }
    
    const initials = `${firstInitial}${lastInitial}`;
    
    const avatarInner = params.user.avatarUrl 
      ? `<img src="${params.user.avatarUrl}" alt="${nameToShow}" class="avatar-img">`
      : `<span class="avatar-initial">${initials}</span>`;

    userAvatarHTML = `
      <div class="nav-user">
        <span class="user-name">${nameToShow}</span>
        <div class="avatar-container">${avatarInner}</div>
        <a href="/test-logout" class="btn-logout">Esci</a>
      </div>
    `.trim();
  }

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/css/${cssFile}?v=${appVersion}">
</head>
<body>

  <!-- NAVBAR FIXED TOP A TRE COLONNE -->
  <header class="navbar-fixed">
    <div class="nav-column nav-left">
      <nav class="main-nav">
        ${navLinksHTML}
      </nav>
    </div>
    <div class="nav-column nav-center"></div>
    <div class="nav-column nav-right">
      ${userAvatarHTML}
    </div>
  </header>
  
  <!-- CORPO CENTRALE LIBERO E FLESSIBILE -->
  <main class="main-wrapper">
    <div class="container-fluid">
      ${content}
    </div>
  </main>

  <!-- FOOTER A TRE COLONNE BLOCCATO IN BASSO -->
  <footer class="footer-global">
    <div class="footer-column footer-left">
      <p>&copy; ${new Date().getFullYear()} - ${currentProject}</p>
    </div>
    <div class="footer-column footer-center">
      <p>Versione: v${appVersion}</p>
    </div>
    <div class="footer-column footer-right">
      <p>Linee Guida JSON</p>
    </div>
  </footer>

</body>
</html>
  `.trim();
}

module.exports = { layout };
