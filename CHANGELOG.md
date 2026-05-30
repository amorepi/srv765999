## [30-05-2026 20:13][v1.0.07] - Organizzazione del layout
* Fix: preorganizzazione del sito per un layout generalizzato con correzioni varie

## [30-05-2026 13:10][v1.0.06] - Revisione del template layout
**feature/layout**: Revisione del template layout.js che prevede

* una barra "nav" a tre colonne per accogliere il Logo e l'avatar user con fixed top
* corpo centrale libero e flessibile
* creazione di un "footer"in fondo alla pagina a tre colonne per esporre informazioni varie (versione, ...)
* Adeguamento delle pagine di errore con eliminazione di error.css

## [30-05-2026 00:38][v1.0.05] - Revisione a seguito di mailer

* **Server.js** e **backend/routes/mainRoutes.js** sono stati ristrutturati con revisione e spostamento della gestione errori di sistema all'interno di **backend/routes/mainRoutes.js**

## [29-05-2026 23:33][v1.0.04] - Nuove caratteristiche

- **feature/mailer**: realizzazione di una mail di servizio adibita a informare il responsabile del sito di eventuali errori sopravvenuti o eventuali tentativi che tendono a 'bucare' il sito stesso:
  - **npm install nodemailer**
  - crea il file **backend/mailer.js**
  - Modifica **`backend/routes/mainRoutes.js`** introducendo la rotta /error-test
  - Esegui test-verifica: [https://ingamore.org/error-test](https://ingamore.org/error-test)

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

