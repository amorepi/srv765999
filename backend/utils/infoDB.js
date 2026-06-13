const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

/**
 * Recupera le informazioni aggregate del database di progetto, degli utenti e dei backup.
 * @param {string} mongoUri - Stringa di connessione (richiede privilegi admin)
 * @param {string} backupDir - Percorso della cartella contenente i file zip di backup
 * @param {string} projectName - Nome del database del progetto corrente ($PROJECT)
 * @returns {Promise<Object>} Oggetto contenente i dati strutturati per la dashboard
 */
async function getDatabaseOverview(mongoUri, backupDir, projectName) {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    
    // 1. STATISTICHE DEL DATABASE TARGET (DINAMICO)
    const dbTarget = client.db(projectName);
    let statsTarget = { collections: 0, dataSize: 0, storageSize: 0 };
    
    try {
      statsTarget = await dbTarget.command({ dbStats: 1 });
    } catch (err) {
      console.error(`Avviso: Impossibile leggere le statistiche di ${projectName}:`, err.message);
    }

    // 2. RECUPERO UTENTI GLOBALI (con showAllScopes per vedere anche gli utenti confinati)
    const dbAdmin = client.db("admin");
    let utenti = [];
    
    try {
      const usersResult = await dbAdmin.command({ usersInfo: 1, showAllScopes: true });
      if (usersResult && usersResult.users) {
        utenti = usersResult.users.map(u => ({
          user: u.user,
          db: u.db,
          roles: u.roles.map(r => `${r.role}@${r.db}`)
        }));
      }
    } catch (err) {
      console.error("Avviso: Impossibile recuperare la lista utenti:", err.message);
      utenti = [{ error: "Privilegi insufficienti per leggere gli utenti dell'istanza" }];
    }

    // 3. SCANSIONE CARTELLA BACKUP
    let backups = [];
    if (backupDir && fs.existsSync(backupDir)) {
      try {
        const files = fs.readdirSync(backupDir);
        
        backups = files
          .filter(file => file.endsWith('.zip'))
          .map(file => {
            const filePath = path.join(backupDir, file);
            const fileStats = fs.statSync(filePath);
            
            return {
              file: file,
              data: fileStats.mtime.toLocaleString('it-IT'),
              peso_MB: parseFloat((fileStats.size / (1024 * 1024)).toFixed(2))
            };
          })
          .sort((a, b) => b.file.localeCompare(a.file));
      } catch (err) {
        console.error("Avviso: Errore durante la lettura della cartella backup:", err.message);
      }
    }

    // 4. RITORNO DEI DATI COMPLETI
    return {
      database: {
        nome: projectName,
        collezioni: statsTarget.collections || 0,
        dimensioneDati_MB: parseFloat(((statsTarget.dataSize || 0) / (1024 * 1024)).toFixed(2)),
        occupazioneDisco_MB: parseFloat(((statsTarget.storageSize || 0) / (1024 * 1024)).toFixed(2))
      },
      utenti_istanza: utenti,
      backup_disponibili: backups
    };

  } finally {
    await client.close();
  }
}

module.exports = { getDatabaseOverview };
