const { openApp } = require('./appModule');
const { executeWorkspace } = require('./workspaceModule');
const { captureScreen } = require('./screenModule');

function normalize(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

const moduleMap = {
  'iniciar secuencia de aplicación': openApp,
  'iniciar protocolo de trabajo': executeWorkspace,
  'capturar pantalla': captureScreen,
};

async function executeCommand(action, parameter, ws) {
  const normalizedAction = normalize(action);

  console.log('[SERVER] Acción original:', action);
  console.log('[SERVER] Acción normalizada:', normalizedAction);

  let handler = null;
  let matchedKey = null;

  for (const key in moduleMap) {
    if (
      normalizedAction === key ||
      normalizedAction.includes(key) ||
      key.includes(normalizedAction)
    ) {
      handler = moduleMap[key];
      matchedKey = key;
      console.log('[SERVER] Match encontrado:', key);
      break;
    }
  }

  if (handler) {
    let finalParam = parameter;

    if (!finalParam) {
      if (normalizedAction.includes('diseño')) finalParam = 'diseño';
      else if (normalizedAction.includes('desarrollo')) finalParam = 'desarrollo';
      else finalParam = '';
    }

    try {
      await handler(finalParam, ws); // 🔥 CLAVE
    } catch (err) {
      console.error('[SERVER ERROR]', err);

      ws.send(JSON.stringify({
        status: 'error',
        message: err.message
      }));
    }

  } else {
    console.log('[SERVER] Acción no reconocida:', normalizedAction);

    ws.send(JSON.stringify({
      status: 'unknown',
      message: `Acción no implementada: ${normalizedAction}`
    }));
  }
}

module.exports = { executeCommand };