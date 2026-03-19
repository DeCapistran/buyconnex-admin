// backend/server.js
const express = require('express');
const path = require('path');
const app = express();

// Configurez le répertoire pour les fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Autres configurations et routes...

// Démarrez le serveur
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
