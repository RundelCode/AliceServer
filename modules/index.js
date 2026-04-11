const { openApp } = require('./appModule');
const { executeWorkspace } = require('./workspaceModule');
const { captureScreen } = require('./screenModule');

const moduleMap = {
  'iniciar secuencia de aplicación': openApp,
  'iniciar protocolo de trabajo': executeWorkspace,
  'capturar pantalla': captureScreen,
};

function executeCommand(action, parameter, ws) {
  const handler = moduleMap[action];
  if (handler) {
    handler(parameter, ws);
  } else {
    ws.send(JSON.stringify({ status: 'unknown', message: `Acción no implementada: ${action}` }));
  }
}

module.exports = { executeCommand };