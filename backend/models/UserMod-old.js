const { MongoClient } = require('mongodb');

const COLLECTION_NAME = 'User';

// ======================================================================
// SCHEMA DI VALIDAZIONE VERIFICABILE DAL CODICE (JSON Schema Nativo)
// ======================================================================
const USER_SCHEMA_VALIDATOR = {
  $jsonSchema: {
    bsonType: "object",
    required: ["firstName", "lastName", "email", "password"],
    properties: {
      firstName: {
        bsonType: "string",
        description: "Deve essere una stringa ed e obbligatorio"
      },
      lastName: {
        bsonType: "string",
        description: "Deve essere una stringa ed e obbligatorio"
      },
      fullName: {
        bsonType: "string",
        description: "Stringa calcolata contenente il nome completo"
      },
      email: {
        bsonType: "string",
        pattern: "^.+@.+$",
        description: "Deve essere un indirizzo email valido ed e obbligatorio"
      },
      password: {
        bsonType: "string",
        description: "Stringa cifrata della password ed e obbligatorio"
      },
      auth: {
        bsonType: "object",
        description: "Sotto-oggetto dei permessi applicativi",
        required: ["profile", "billing", "reports"],
        properties: {
          profile: { bsonType: "number" },
          billing: { bsonType: "number" },
          reports: { bsonType: "number" }
        }
      },
      createdAt: { bsonType: "date" },
      updatedAt: { bsonType: "date" }
    }
  }
};

const INDEXES_CONFIG = [
  { key: { email: 1 }, options: { unique: true } }
];

/**
 * Inizializza la collezione applicando lo schema di validazione e gli indici.
 * Se la collezione esiste gia, aggiorna lo schema per recepire eventuali modifiche future.
 */
async function initModel(db) {
  const collections = await db.listCollections().toArray();
  const exists = collections.some(c => c.name === COLLECTION_NAME);
  
  if (!exists) {
    // Creazione con validatore nativo
    await db.createCollection(COLLECTION_NAME, {
      validator: USER_SCHEMA_VALIDATOR
    });
  } else {
    // EVOLUZIONE DEL CODICE: Se la collezione esiste gia, aggiorna lo schema sul DB
    // Questo permette di gestire la congruita di modifiche e nuovi campi nel tempo
    await db.command({
      collMod: COLLECTION_NAME,
      validator: USER_SCHEMA_VALIDATOR
    });
  }
  
  // Allineamento indici unici
  for (const idx of INDEXES_CONFIG) {
    await db.collection(COLLECTION_NAME).createIndex(idx.key, idx.options);
  }

  // Auto-popolamento controllato
  const collection = db.collection(COLLECTION_NAME);
  const utentiIniziali = [
    {
      firstName: "Mario",
      lastName: "Rossi",
      email: "mario.rossi@esempio.com",
      password: "password_cifrata_mario",
      auth: { profile: 0, billing: 0, reports: 0 }
    },
    {
      firstName: "Piero",
      lastName: "Amministratore",
      email: "piero.admin@esempio.com",
      password: "password_cifrata_piero",
      auth: { profile: 1, billing: 1, reports: 1 }
    }
  ];

  for (const utente of utentiIniziali) {
    const emailLower = utente.email.toLowerCase().trim();
    const esiste = await collection.findOne({ email: emailLower });
    
    if (!esiste) {
      const doc = {
        firstName: utente.firstName.trim(),
        lastName: utente.lastName.trim(),
        fullName: `${utente.firstName} ${utente.lastName}`.trim(),
        email: emailLower,
        password: utente.password,
        auth: utente.auth,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await collection.insertOne(doc);
    }
  }

  return COLLECTION_NAME;
}

// ======================================================================
// FUNZIONI CRUD PER INTERROGARE E MANIPOLARE I DATI
// ======================================================================

async function create(db, userData) {
  const collection = db.collection(COLLECTION_NAME);
  const emailLower = userData.email.toLowerCase().trim();
  
  const doc = {
    firstName: userData.firstName.trim(),
    lastName: userData.lastName.trim(),
    fullName: `${userData.firstName} ${userData.lastName}`.trim(),
    email: emailLower,
    password: userData.password,
    auth: {
      profile: userData.auth?.profile ?? 0,
      billing: userData.auth?.billing ?? 0,
      reports: userData.auth?.reports ?? 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return await collection.insertOne(doc);
}

async function findByEmail(db, email) {
  const collection = db.collection(COLLECTION_NAME);
  return await collection.findOne({ email: email.toLowerCase().trim() });
}

async function findAll(db) {
  const collection = db.collection(COLLECTION_NAME);
  return await collection.find({}).toArray();
}

async function updateByEmail(db, email, updateData) {
  const collection = db.collection(COLLECTION_NAME);
  const targetEmail = email.toLowerCase().trim();
  
  const setFields = { ...updateData, updatedAt: new Date() };
  
  if (updateData.firstName || updateData.lastName) {
    const corrente = await collection.findOne({ email: targetEmail });
    const fName = updateData.firstName || corrente.firstName;
    const lName = updateData.lastName || corrente.lastName;
    setFields.fullName = `${fName} ${lName}`.trim();
  }
  
  if (updateData.email) {
    setFields.email = updateData.email.toLowerCase().trim();
  }

  return await collection.updateOne({ email: targetEmail }, { $set: setFields });
}

async function deleteByEmail(db, email) {
  const collection = db.collection(COLLECTION_NAME);
  return await collection.deleteOne({ email: email.toLowerCase().trim() });
}

module.exports = {
  COLLECTION_NAME,
  USER_SCHEMA_VALIDATOR, // Esportato per eventuali test di conformita strutturale
  initModel,
  create,
  findByEmail,
  findAll,
  updateByEmail,
  deleteByEmail
};
