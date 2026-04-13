const { openApp } = require('./appModule');
const { executeWorkspace } = require('./workspaceModule');
const { captureScreen } = require('./screenModule');
const { saveNewApp } = require('./learnModule');

function normalize(text) {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

const moduleMap = {
  'iniciar secuencia de aplicación': openApp,
  'abrir app': openApp,
  'iniciar protocolo de trabajo': executeWorkspace,
  'capturar pantalla': captureScreen,
  'guardar app': saveNewApp
};

async function executeCommand(action, parameter, ws) {
  const normalized = normalize(action);
  console.log(`[SERVER] Acción: "${action}" → "${normalized}"`);

  for (const key in moduleMap) {
    if (normalized.includes(key) || key.includes(normalized)) {
      try {
        await moduleMap[key](parameter, ws);
        return;
      } catch (err) {
        console.error('[EXEC ERROR]', err);
        ws.send(JSON.stringify({ status: 'error', message: err.message }));
        return;
      }
    }
  }

  ws.send(JSON.stringify({
    status: 'unknown',
    message: `Acción no reconocida: ${action}`
  }));
}

module.exports = { executeCommand };