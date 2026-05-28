/**
 * Genera il layout HTML standard dell'applicazione in modo agnostico.
 * @param {Object} params - Oggetto JSON contenente i parametri di rendering.
 * @param {string} params.title - Il titolo della pagina.
 * @param {string} params.content - Il contenuto HTML da inserire nel body.
 * @param {string} [params.cssFile="style.css"] - Il nome del file CSS principale da caricare.
 * @returns {string} Pagina HTML completa.
 */
function getLayoutHTML(params) {
  const title = params.title || "Applicazione";
  const content = params.content || "<p>Nessun contenuto disponibile.</p>";
  const cssFile = params.cssFile || "style.css";
  // Recupera dinamicamente il nome del server/progetto dalla variabile d'ambiente
  const vpsName = process.env.MY_VPS || "Server di Produzione";

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/css/${cssFile}">
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/dashboard">Dashboard</a>
    </nav>
  </header>
  
  <main class="main-container">
    ${content}
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} - Servizio ${vpsName} | Tutti i diritti riservati</p>
  </footer>
</body>
</html>
  `.trim();
}

module.exports = { getLayoutHTML };
