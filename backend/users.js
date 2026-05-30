const { MongoClient } = require('mongodb');

// Recupera il nome del progetto dal file .env per comporre il database in modo agnostico
const projectName = process.env.PROJECT || 'default_db';
const mongoUri = process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${projectName}`;

// Inizializzazione del client MongoDB nativo
const client = new MongoClient(mongoUri);
let db;

/**
 * Connette al database e inizializza la collezione Users inserendo gli utenti di test se vuota.
 * @param {Object} params - Oggetto JSON unico per la configurazione.
 * @returns {Promise<Object>} La collezione degli utenti.
 */
async function users(params) {
  if (!db) {
    await client.connect();
    db = client.db();
    console.log(`[users] Connessione al database [${db.databaseName}] completata con successo.`);
    
    const userCollection = db.collection('users');
    const count = await userCollection.countDocuments();
    
    if (count === 0) {
      console.log("[users] Collezione vuota. Inserimento utenti di test per ogni ruolo...");
      
      const utentiTest = [
        {
          name: "Piero",
          lastName: "Amore",
          fullName: "Piero Amore",
          mail: "piero@ingamore.it",
          password: "admin456",
          role: "admin",
          avatarUrl: "", 
          permission: { level: 10, dashboard: true, logs: true, backup: true }
        },
        {
          name: "Mario",
          lastName: "Rossi",
          fullName: "Mario Rossi",
          mail: "mario@esempio.com",
          password: "user456",
          role: "user",
          avatarUrl: "https://unsplash.com", 
          permission: { level: 5, dashboard: true, logs: false, backup: false }
        }
      ];
      
      await userCollection.insertMany(utentiTest);
      console.log("[users] Utenti di test inseriti correttamente.");
    }
  }
  return db.collection('users');
}

module.exports = { users };
