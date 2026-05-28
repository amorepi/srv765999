require('dotenv').config();
const express = require('express')
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express()

// Middleware globali (Parsing JSON, etc.)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// File statici (Immagini, CSS, JS del frontend)
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
