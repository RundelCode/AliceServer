const { runCMD, runEXE } = require('../utils/runner');
const { resolveApp } = require('../utils/appResolver');

async function openApp(parameter, ws) {
  const app = resolveApp(parameter);

  if (!app) {
    ws.send(JSON.stringify({
      status: 'error',
      message: `No se pudo resolver: ${parameter}`
    }));
    return;
  }

  try {
    if (app.type === 'cmd') {
      await runCMD(app.command);
    } else {
      await runEXE(app.path, app.args || []);
    }

    ws.send(JSON.stringify({
      status: 'ok',
      message: `${parameter} abierto`
    }));

  } catch (err) {
    console.error(err);

    ws.send(JSON.stringify({
      status: 'error',
      message: err.message
    }));
  }
}

module.exports = { openApp };