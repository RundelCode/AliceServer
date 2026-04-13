const { runCMD, runEXE } = require('../utils/runner');
const { resolveApp } = require('../utils/appResolver');

async function openApp(parameter, ws) {
  if (!parameter) {
    return ws.send(JSON.stringify({
      status: 'error',
      message: 'Falta el nombre de la aplicación'
    }));
  }

  const app = resolveApp(parameter);

  console.log(`[openApp] Intentando abrir: ${parameter} (${app.type})`);

  try {
    if (app.type === 'cmd') {
      await runCMD(app.command);
      console.log(`[openApp] Comando CMD ejecutado: ${app.command}`);
    }
    else if (app.type === 'exe') {
      await runEXE(app.path, app.args || []);
      console.log(`[openApp] EXE ejecutado: ${app.path}`);
    }
    else {
      throw new Error('Tipo de aplicación desconocido');
    }

    ws.send(JSON.stringify({
      status: 'ok',
      message: `${parameter} abierto correctamente`
    }));

  } catch (err) {
    console.error(`[openApp ERROR] ${parameter}:`, err.message);

    ws.send(JSON.stringify({
      status: 'error',
      message: `No se pudo abrir ${parameter}`
    }));
  }
}

module.exports = { openApp };