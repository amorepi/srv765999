## [29-05-2026 17:31][v1.0.02] - Nuove caratteristiche
- **feature/mdToHtml** - Conversione e visualizzazione di un file .md in un file .html
  - **npm install marked**
  - Crea la funzione il file **backend/mdToHtml.js**
  - Revisione del file **backend/routes/mainRoutes.js**
  - Crea Route: creazione del percorso **/view-tags**
  - Crea test-verifica: **http://localhost:3000/view-tags**

## [29-05-2026 01:29][v1.0.01] - Nuove caratteristiche

* **feature/mainRoutes****
  * Creazione della directory **backend/routes** e definizione del codice in **mainRoutes.js** per la gestione delle routes. Vengono operate modifiche su **server.js**
* **feature/errorSystem**
  * Creazione o Revisione del template **backend/layout.js** per uniformare le visualizzazioni di pagine html (template, errori e layout di sistema)
  * **Gestione degli errori** centralizzata (Middleware per rotte inesistenti 404 e cattura errori globali 500)

## [28-05-2026 15:33][v1.0.00] - Initial Start

Creazione del progetto di installazione

