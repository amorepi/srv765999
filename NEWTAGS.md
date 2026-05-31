## Revisione Homepage

**feature/homepage**: per evitare le complicazioni della visualizzazione di una homepage con header e footer fissi su altri dispositivi (iPad, iPhone, ecc...), è preferibile rimuovere totalmente il footer ed operare con la header fissa e il resto della pagina fluttuante. A tale scopo vengono apportate le  seguenti modifiche:

* Creazione della cartella **Public/img** che accoglie le immagini di sistema del progetto
* Disponibilità come variabili di ambiente (.env)
  * LOGO_PROJ=MiniserviziLogo50.png
  * AVATAR_PROJ=User.png
* Header ora è così strutturato:
  * LOGO_PROJ   Home  -  Versione  -  btn-Accedi oppure
  * LOGO_PROJ   Home  Dashboard  -  Versione  -  AVATAR_PROJ  Esci oppure
  * LOGO_PROJ   Home  Dashboard  -  Versione  -  Foto_User  Esci
  * negli ultimi due casi il passaggio del mouse su avatar o su foto fa comparire il Nome e Cognome dell'utente
* Nel percorso public/uploads/users/ esiste, a scopo di verifica e collaudo, la mia foto (AmorePietro.jpg). Immagino che successivamente sarà <id_user>.jpg
* Uniformare la versione allo standard vX.X.XX e correzioni nel progetto


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

