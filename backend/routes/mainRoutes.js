const express = require('express');
const router = express.Router();
const path = require('path');

// Route Principale: Serve l'interfaccia frontend statica
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

// Altre routes da implementare

module.exports = router;
