const express = require('express');
const routes = require('./routes');

function startExpressServer() {
    const app = express();
    app.use(express.json());
    app.use('/api', routes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🌐 REST API Server berjalan di port ${PORT}`);
    });
}

module.exports = { startExpressServer };