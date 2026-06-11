# MANIFESTO DI CONTESTO - PROGETTO srv765999

## 🛠️ Stack Tecnologico & Infrastruttura

- VPS Linux (Accesso Root via SSH chiavi sicure, IP: 69.62.118.235)
- Architettura: Nginx (Reverse Proxy) -> Node.js (Moduli ES, server.js) -> PM2 -> MongoDB
- Percorso remoto principale: /var/www/srv765999
- Percorso log di errore PM2: /root/.pm2/logs/srv765999-error.log
- Utente applicativo non-root: amorepi

## 🛡️ Regole di Deploy & Blindatura File System (Fase A)

1. I file ".env" e ".gitignore" sulla VPS sono protetti con l'attributo di immutabilità (chattr +i).
2. Prima di rsync o modifiche, lo script sblocca i file (chattr -f -i -a) e poi li riblinda.
3. Al termine di ogni manipolazione di file nella radice, i permessi vanno tassativamente riallineati (chown -R amorepi:amorepi).
4. ECCEZIONE REGOLA FASE A: Se la versione da archiviare è la base "v1.0.00" (deploy dopo reset), l'archiviazione preventiva viene saltata automaticamente per mantenere il file system pulito.
5. OPZIONE RESET: La digitazione della parola "reset" esegue un ciclo di sblocco (chattr) e rimozione radicale (rm -rf) di tutte le vecchie cartelle storiche v* residue sulla VPS, prima di azzerare i tag Git e rinizializzare il root-commit alla v1.0.00.

## 🚀 Logica di Rollback Atomico Continuo (Fase B)

1. L'Health Check interroga l'endpoint "/health" locale (http://localhost/health). Se lo stato HTTP è != 200 (es. 502), si attiva il Rollback continuo direttamente dalla VPS.
2. Prima di toccare i file, lo script accoda le ultime 50 righe di "pm2 logs" nel file di log di errore ufficiale di PM2 con marcatura TIMESTAMP. Non si usano file temporanei per i log.
3. Il ciclo "while" sulla VPS identifica la versione precedente valida escludendo quella corrotta corrente (ls -d ...v* | grep -v '${CURRENT_VERSION}' | sort -V | tail -n 1).
4. La cartella corrotta viene eliminata e viene ripristinato il backup stabile. Se anche il backup ripristinato fallisce l'Health Check, il ciclo "while" scala ulteriormente all'indietro a catena fino a trovare la prima release storicamente sana che risponde con HTTP 200.

## ✍️ Stile di Sviluppo richiesto all'AI

- Risposte ad altissima densità informativa, senza codice ridondante o supposizioni.
- Controllo rigoroso della sintassi Bash, dei caratteri di escape (\$) e delle virgolette annidate nei comandi SSH.
- Approccio architetturale "Lean" (snello), prediligendo logiche native della shell.
  

