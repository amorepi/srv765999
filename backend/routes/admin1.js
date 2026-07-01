const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { getDatabaseOverview } = require('../utils/infoDB');
const UserMod = require('../models/UserMod');

// L'URL diventa generico e riutilizzabile. Il controllo chirurgico degli accessi
// verra gestito internamente tramite i middleware dei permessi.
router.get('/api/infodb', async (req, res) => {
  const mongoUri = process.env.MONGO_URI; 
  const backupDir = process.env.BACKUP_DIR;
  const dbProject = process.env.PROJECT;

  if (!mongoUri || !dbProject) {
    return res.status(500).json({
      success: false,
      error: "Configurazione di sistema incompleta (MONGO_URI o PROJECT mancanti)"
    });
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db(dbProject);

    const panoramica = await getDatabaseOverview(mongoUri, backupDir, dbProject);

    let utentiReali = [];
    try {
      utentiReali = await UserMod.findAll(db);
    } catch (err) {
      console.error("Avviso: Impossibile leggere i dati da UserMod:", err.message);
      return res.json({
        success: true,
        ...panoramica,
        utenti_istanza: { error: "Collezione non inizializzata o utente operativo mancante" }
      });
    }

    const utentiFormattati = utentiReali.map(u => ({
      user: u.fullName || `${u.firstName} ${u.lastName}`,
      db: dbProject,
      roles: [
        `Profile: ${u.auth?.profile ?? 0}`,
        `Billing: ${u.auth?.billing ?? 0}`,
        `Reports: ${u.auth?.reports ?? 0}`
      ]
    }));

    res.json({
      success: true,
      database: panoramica.database,
      backup_disponibili: panoramica.backup_disponibili,
      utenti_istanza: utentiFormattati
    });

  } catch (error) {
    console.error("Errore rotta infoDB:", error.message);
    res.status(500).json({
      success: false,
      error: "Impossibile recuperare i dati dal server",
      dettaglio: error.message
    });
  } finally {
    await client.close();
  }
});

module.exports = router;
