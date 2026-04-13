const { WebSocketServer } = require('ws');
const http = require('http');
const { getLocalIP } = require('./utils/network');
const { executeCommand } = require('./modules/index');
const { ensureDataDir } = require('./utils/appResolver');

const PORT = 8765;
const DISCOVERY_PORT = 8766;

ensureDataDir();

const wss = new WebSocketServer({ port: PORT });
console.log(`Alice Server corriendo en ws://localhost:${PORT}`);

const discoveryServer = http.createServer((req, res) => {
  if (req.url === '/alice') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      type: 'ALICE_SERVER',
      ip: getLocalIP(),
      port: PORT
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

discoveryServer.listen(DISCOVERY_PORT, () => {
  console.log(`Discovery HTTP escuchando en puerto ${DISCOVERY_PORT}`);
});

wss.on('connection', (ws) => {
  console.log('Celular conectado');

  ws.on('message', async (raw) => {
    let message;

    try {
      const text = raw.toString();
      message = JSON.parse(text);

      const { action, parameter } = message;

      if (!action) {
        ws.send(JSON.stringify({ 
          status: 'error', 
          message: 'Acción requerida' 
        }));
        return;
      }

      await executeCommand(action, parameter, ws);

    } catch (err) {
      console.error('[MESSAGE ERROR]', err);

      try {
        ws.send(JSON.stringify({
          status: 'error',
          message: 'Comando inválido o error interno'
        }));
      } catch (sendError) {
        console.error('[SEND ERROR] No se pudo responder al cliente');
      }
    }
  });

  ws.on('error', (err) => {
    console.error('[WS ERROR]', err.message);
  });

  ws.on('close', () => {
    console.log('Celular desconectado');
  });
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
});

console.log('Servidor listo y con manejo de errores mejorado');