const express = require('express');
const router = express.Router();
const { getDatabaseOverview } = require('../utils/infoDB');

// Assicurati di applicare qui i tuoi middleware di protezione esistenti!
// esempio: router.get('/api/admin/infodb', autenticazioneAdmin, async (req, res) => {
router.get('/api/admin/infodb', async (req, res) => {
  const mongoUri = process.env.MONGO_URI; 
  const backupDir = process.env.BACKUP_DIR;
  const dbProject = process.env.PROJECT; // Estratto dal file .env (es. srv765999)

  // Verifica immediata che le variabili vitali siano configurate nel manifesto/.env
  if (!mongoUri || !dbProject) {
    return res.status(500).json({
      success: false,
      error: "Configurazione di sistema incompleta (MONGO_URI o PROJECT mancanti)"
    });
  }

  try {
    const data = await getDatabaseOverview(mongoUri, backupDir, dbProject);
    
    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error("Errore rotta infoDB:", error.message);
    res.status(500).json({
      success: false,
      error: "Impossibile recuperare i dati del server",
      dettaglio: error.message
    });
  }
});

module.exports = router;
