const { WebSocketServer } = require('ws');
const http = require('http');
const { getLocalIP } = require('./utils/network');
const { executeCommand } = require('./modules/index');

const PORT = 8765;
const DISCOVERY_PORT = 8766;

const wss = new WebSocketServer({ port: PORT });
console.log(`Alice Server corriendo en ws://localhost:${PORT}`);

const discoveryServer = http.createServer((req, res) => {
  if (req.url === '/alice') {
    const localIP = getLocalIP();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ type: 'ALICE_SERVER', ip: localIP, port: PORT }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

discoveryServer.listen(DISCOVERY_PORT, () => {
  console.log(`Discovery HTTP en puerto ${DISCOVERY_PORT}`);
});

wss.on('connection', (ws) => {
  console.log('Celular conectado');

  ws.on('message', (raw) => {
    try {
      const message = JSON.parse(raw.toString());
      console.log('Comando recibido:', message);
      const { action, parameter } = message;
      executeCommand(action, parameter, ws);
    } catch (e) {
      ws.send(JSON.stringify({ status: 'error', message: 'Comando inválido' }));
    }
  });

  ws.on('close', () => {
    console.log('Celular desconectado');
  });
});