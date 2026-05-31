const path = require('path');

/**
 * Genera il layout HTML standard con Header Fixed a tre colonne geometriche.
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
  
  const logoFile = process.env.LOGO_PROJ || "logo.png";
  const defaultAvatar = process.env.AVATAR_PROJ || "User.png";
  const packageJson = require(path.join(process.cwd(), 'package.json'));
  const appVersion = packageJson.version || "1.1.0";

  const formattedVersion = appVersion.startsWith('v') ? appVersion : `v${appVersion}`;

  // 1. COLONNA SINISTRA (Logo + Link accorpati)
  let navLeftHTML = `
    <a href="/" class="logo-link">
      <img src="/img/${logoFile}" alt="Logo" class="logo-img">
    </a>
    <a href="/" class="nav-link-item">Home</a>
  `;
  if (params.user) {
    navLeftHTML = `
      <a href="/" class="logo-link">
        <img src="/img/${logoFile}" alt="Logo" class="logo-img">
      </a>
      <a href="/" class="nav-link-item">Home</a>
      <a href="/dashboard" class="nav-link-item">Dashboard</a>
    `;
  }

  // 2. COLONNA CENTRALE (Esclusivamente la versione)
  const navCenterHTML = `<span class="nav-version">${formattedVersion}</span>`;

  // 3. COLONNA DESTRA (Accedi oppure Profilo + Esci)
  let navRightHTML = `<a href="/login" class="btn-login">Accedi</a>`;
  
  if (params.user) {
    const nameToShow = params.user.fullName || `${params.user.name || ''} ${params.user.lastName || ''}`.trim() || "Utente";
    let imgSrc = `/img/${defaultAvatar}`;
    if (params.user.avatarUrl) {
      imgSrc = params.user.avatarUrl;
    }

    navRightHTML = `
      <div class="nav-user" title="${nameToShow}">
        <div class="avatar-container">
          <img src="${imgSrc}" alt="${nameToShow}" class="avatar-img">
        </div>
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
  <link rel="stylesheet" href="/css/${cssFile}?v=${formattedVersion}">
</head>
<body>

  <!-- HEADER FIXED TOP A TRE COLONNE DISTINTE -->
  <header class="navbar-fixed">
    <!-- Sinistra: Logo e Navigazione accorpati -->
    <div class="nav-column nav-left">
      <nav class="main-nav">
        ${navLeftHTML}
      </nav>
    </div>
    
    <!-- Centro: Esclusivamente la versione -->
    <div class="nav-column nav-center">
      ${navCenterHTML}
    </div>
    
    <!-- Destra: Avatar o Accedi -->
    <div class="nav-column nav-right">
      ${navRightHTML}
    </div>
  </header>
  
  <!-- CORPO CENTRALE LIBERO E FLUTTUANTE -->
  <main class="main-wrapper">
    <div class="container-fluid">
      ${content}
    </div>
  </main>

</body>
</html>
  `.trim();
}

module.exports = { layout };
