## TODO

- **Gestione Permessi in Stile Linux**: Implementata la struttura a oggetti per il campo `auth` (`profile`, `billing`, `reports`) con logica a livelli numerici (0, 3, 4) ispirata ai permessi POSIX.
- **Automatizzazione dei Campi Calcolati**: Introdotto un middleware Mongoose pre-save nel modello per calcolare e formattare automaticamente il campo `fullName` combinando `firstName` e `lastName`.
- **Sicurezza delle API**: Configurato il controllore per escludere nativamente la password (`-password`) dalle risposte JSON durante le query di lettura (`allUsers`, `getUser`).

