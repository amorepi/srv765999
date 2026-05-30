function layout(params) {
  const title = params.title || "Applicazione";
  const content = params.content || "<p>Nessun contenuto disponibile.</p>";
  const cssFile = params.cssFile || "styles.css";
  
  const vpsName = process.env.MY_VPS || "Server di Produzione";
  const appVersion = process.env.npm_package_version || "1.0.05";

  let userAvatarHTML = `<div class="nav-user"><a href="/login" class="btn-login">Accedi</a></div>`;
  
  if (params.user) {
    const nameToShow = params.user.fullName || params.user.name || "Utente";
    const initial = (params.user.name || "U").charAt(0).toUpperCase();
    
    const avatarInner = params.user.avatarUrl 
      ? `<img src="${params.user.avatarUrl}" alt="${nameToShow}" class="avatar-img">`
      : `<span class="avatar-initial">${initial}</span>`;

    userAvatarHTML = `
      <div class="nav-user">
        <span class="user-name">${nameToShow}</span>
        <div class="avatar-container">${avatarInner}</div>
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
        <!-- Colonna Sinistra: Link vicini di navigazione -->
        <div class="nav-column nav-left">
            <nav class="main-nav">
                <a href="/">Home</a>
                <a href="/dashboard">Dashboard</a>
            </nav>
        </div>
        <!-- Colonna Centrale: Vuota e libera -->
        <div class="nav-column nav-center"></div>
        <!-- Colonna Destra: Avatar o Accedi -->
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

    <!-- FOOTER A TRE COLONNE -->
    <footer class="footer-global">
        <div class="footer-column footer-left">
            <p>&copy; ${new Date().getFullYear()} - ${vpsName}</p>
        </div>
        <!-- Versione Corrente bloccata al centro del footer -->
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
