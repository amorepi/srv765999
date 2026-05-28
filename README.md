# 🌐 Nginx Node.js PM2 Automation Pipeline

[![Ubuntu 24.04 LTS](https://shields.io)](https://ubuntu.com)
[![Node.js Version](https://shields.io)](https://nodejs.org)
[![License: MIT](https://shields.io)](https://opensource.org)

Un framework modulare di infrastruttura-come-codice (IaC) progettato per automatizzare il deployment, la messa in sicurezza e l'aggiornamento continuo di applicazioni Node.js su server VPS Ubuntu.

---

## 🎯 Obiettivi del Progetto

* **Automazione Totale**: Configurazione guidata da zero (Stato Zero) fino all'applicazione online in HTTPS.
* **Hardening di Sicurezza**: Isolamento dei privilegi utente, restrizione rigida dei permessi del File System (644/755/600) e protezione dei file `.env`.
* **Zero Downtime**: Pipeline di aggiornamento e sincronizzazione atomica tramite `rsync` e gestione dei processi con PM2.

---

## 🏗️ Architettura e Stack Tecnologico

Il sistema standardizza e isola i componenti principali sulla VPS:

* **Web Server / Reverse Proxy**: Nginx (gestione Virtual Host e crittografia TLS/SSL Let's Encrypt).
* **Runtime**: Node.js 25.x + npm 11.x (distribuzione NodeSource ufficiale).
* **Process Management**: PM2 (avviato come demone di sistema sotto utente non-root dedicato).
* **Database**: MongoDB (base dati documentale NoSQL).

---

## 📂 Struttura della Pipeline (Moduli Bash)

L'orchestrazione è suddivisa in script indipendenti per garantire massima manutenibilità:

| Script | Nome | Descrizione |
| :--- | :--- | :--- |
| `00` | `orchestrator.sh` | Inizializza le variabili d'ambiente e allinea le chiavi SSH locali. |
| `02` | `update-key-access.sh` | Configura i criteri di accesso SSH sicuri sulla VPS. |
| `03` | `create-project.sh` | Predisporrà l'alberatura delle cartelle locali e remote. |
| `04` | `deploy-to-vps.sh` | Sincronizza i file sorgente dal computer locale al server. |
| `05` | `setup-nginx.sh` | Installa Nginx, configura il routing e richiede i certificati SSL. |
| `06` | `setup-node-pm2.sh` | Configura l'ambiente di runtime e avvia l'applicazione Node.js. |
| `07` | `setup-permessi.sh` | **Modulo di Hardening**: Isola e riallinea i permessi dei file. |
| `99` | `resetenv.sh` | Gestisce l'incremento di versione, il tracciamento dei tag e il redeploy rapido. |

---

## 📈 Sistema di Versioning e Changelog Integrato

Il progetto segue il semantic versioning gestito automaticamente dallo script `99-resetenv.sh`.

### 🏷️ Cronologia Rilasci (Changelog)

* **`v1.0.01`** (In Sviluppo)
  * 🔧 Corretto bug di installazione del pacchetto NodeSource (passaggio da `node` a `nodejs`).
  * 🔒 Separazione del modulo `07-setup-permessi.sh` per l'uniformità dei permessi post-deploy.
  * 🔄 Integrazione della sincronizzazione atomica dei file `.env` e `.gitignore`.
* **`v1.0.00`**
  * 🚀 Rilascio iniziale dello scheletro dell'infrastruttura di automazione.

---

## 🛠️ Guida Rapida all'Uso

### Primo Deployment

Per eseguire l'intera pipeline su una VPS Ubuntu 24.04 pulita:

```bash
bash 00-orchestrator.sh
```

### Aggiornamento e Sincronizzazione Codice

Per caricare le modifiche ed effettuare il bump automatico di versione nel file `package.json`:

```bash
bash 99-resetenv.sh
```

---

## 📄 Licenza e Contatti

* **Autore**: Pietro ing. Amore (IngAmore)
* **Licenza**: Distribuito sotto licenza MIT. Vedere il file `LICENSE` per ulteriori dettagli.
  

