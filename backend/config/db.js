import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/default_db';

mongoose.connect(mongoUri)
  .then(() => console.log('Database MongoDB connesso con successo tramite Mongoose.'))
  .catch(err => console.error('Errore critico di connessione al DB:', err));

export { mongoose };
