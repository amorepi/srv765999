## [29-05-2026 18:17][v1.0.03] - Visualizza TODO
- **feature/view-todo**
  - Creazione della route **/view-todo** in **backend/routes/mainRoutes.js** per visualizzare la sezione TODO in NEWTAGS.md
  - Esegui test-verifica: [https://ingamore.org/view-todo](https://ingamore.org/view-todo)

## [29-05-2026 17:31][v1.0.02] - Nuove caratteristiche

- **feature/mdToHtml** - Conversione e visualizzazione di un file .md in un file .html
  - **npm install marked**
  - Crea la funzione con il file **backend/mdToHtml.js**
  - Revisione del file **backend/routes/mainRoutes.js**
  - Crea Route: creazione del percorso **/view-tags**
  - Esegui test-verifica: [https://ingamore.org/view-tags](https://ingamore.org/view-tags)

## [29-05-2026 01:29][v1.0.01] - Nuove caratteristiche

* **feature/mainRoutes****
  * Creazione della directory **backend/routes** e definizione del codice in **mainRoutes.js** per la gestione delle routes. Vengono operate modifiche su **server.js**
* **feature/errorSystem**
  * Creazione o Revisione del template **backend/layout.js** per uniformare le visualizzazioni di pagine html (template, errori e layout di sistema)
  * **Gestione degli errori** centralizzata (Middleware per rotte inesistenti 404 e cattura errori globali 500)

## [28-05-2026 15:33][v1.0.00] - Initial Start

Creazione del progetto di installazione

