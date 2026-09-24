// server.js
const http = require('http');
require('dotenv').config();
const app = require('./app');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
