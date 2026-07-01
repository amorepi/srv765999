import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'node:fs';
import cookieParser from 'cookie-parser';
import { MongoClient } from 'mongodb';
import { mainRoutes } from './backend/routes/mainRoutes.js';

const app = express();



// 1. Lettura centralizzata e unica del package.json al boot del processo
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const CURRENT_VERSION = packageJson.version ? `v${packageJson.version}` : 'v1.1.00';

/**
 * Bootstrap asincrono principale del server e delle connessioni
 */
async function bootstrap() {
  try {
    // 2. Protezione rigorosa della stringa di connessione dentro lo scope locale
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Variabile d'ambiente MONGO_URI mancante nel file .env");
    }

    // 3. Connessione asincrona a MongoDB
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db();
    console.log(`[Bootstrap] Connessione a MongoDB [${db.databaseName}] completata.`);

    // 4. Centralizzazione delle istanze nell'applicazione Express (No globali orfane)
    app.set('db', db);
    app.set('version', CURRENT_VERSION);
    console.log(`[Bootstrap] Variabili di sistema bloccate. Versione: ${CURRENT_VERSION}`);

    // 6. Configurazione dei Middleware di base
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(process.cwd(), 'public')));

    // 7. Aggancio del Router Centralizzato
    app.use('/', mainRoutes);

    // 8. Apertura della porta in ascolto
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`[Bootstrap] Server operativo in modalità ESM sulla porta ${PORT}.`);
    });

  } catch (error) {
    console.error('[Bootstrap CRASH]: Impossibile avviare il sistema:', error);
    process.exit(1);
  }
}

// Esecuzione del ciclo di avvio applicativo
bootstrap();
