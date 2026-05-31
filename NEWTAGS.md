## Revisione Homepage

**feature/homepage**: tutte le operazioni CRUD per gli utenti già creati

## TODO

**feature/usersCrud**: tutte le operazioni CRUD per gli utenti già creati

---

- Realizzazione della pagina **dashboard.js** che mostra le informazioni basilari del sistema (caratteristiche e versioni dei prodotti coinvolti). In questa stessa pagina devono essere presenti pulsanti che consentono di accedere a informazioni tecniche più avanzate ma anche più riservate (log, lista operazioni, ...
- **structure** albero della struttura delle directory del progetto- **LastAccess.js** monstra un elenco degli ultimi accessi- Autenticazione degli utenti
- Autorizzazioni degli utenti
- Backup del database
- Restore del database
- **Regola generale**: Perchè tutte le chiamate a funzioni devono passare i parametri in modalità **JSON** ? perchè in questo modo si ha solo un parametro (oggetto JSON) quando ci sono variazioni nel numero di parametri non costringono lo sviluppatore ad effettaure una ricerca in tutto il progetto per adeguare il numero di parametri passati e non si hanno errori per il numero di parameteri passati
- inserimenti di **Middleware**: indicare il perchè un certo middleware è inserito e relativi vantaggi
- Gestione dei Segnali di Spegnimento (Graceful Shutdown):   In produzione, quando PM2 riavvia l'applicazione (ad esempio durante il tuo `bash deploy.sh`), interrompe bruscamente il processo Node.js. Se un utente sta scaricando una pagina in quel millesimo di secondo, la connessione cade
- Controllo dell'intestazione di Sicurezza (Headers): Express per impostazione predefinita invia un header HTTP chiamato `X-Powered-By: Express
- Controllo dei Log di Errore (Il "Silenziatore" del 500): Nel middleware dell'errore 500 in `server.js` abbiamo inserito `console.error("CRITICAL EXCEPTION:", err.stack);

