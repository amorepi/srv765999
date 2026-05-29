require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mainRoutes = require('./backend/routes/mainRoutes');

const app = express();

// --- MIDDLEWARE GLOBALI ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 

// Servizio file statici (CSS, JS, immagini)
app.use(express.static(path.join(__dirname, 'public')));

// --- INTEGRAZIONE ROTTE E GESTIONE ERRORI ---
// Nota: mainRoutes ora include internamente anche i gestori 404 e 500 in coda
app.use('/', mainRoutes);

// --- AVVIO SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server operativo su porta ${PORT}`));
