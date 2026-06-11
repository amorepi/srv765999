## Connessione MongoDB

La stringa di connessione utilizzerà i parametri amministrativi globali richiesti:
**mongodb://admin:PASSWORD@IP_VPS:27017/srv765999?authSource=admin**

## Struttura Dati

Il documento `user` all'interno della collezione ospiterà la struttura flessibile richiesta:

* `email`: String (Unique)
* `password`: String (Hashed tramite `bcrypt` o `crypto` nativo)
* `name`: String
* `avatar`: String (Percorso in `public/uploads/users/`)
* `permission`: Object (JSON Nativo: `{ "level": "admin", "dashboard": true, "logs": true }`)
* `updatedAt`: Date
* `createdAt`: Date


