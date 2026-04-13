const { runCMD, runEXE } = require('../utils/runner');
const { resolveApp } = require('../utils/appResolver');

// Función auxiliar mejorada para reutilizar apps.json
async function resolveAndRun(appName, extraUrl = null) {
  const app = resolveApp(appName);

  if (app.type === 'cmd') {
    let command = app.command;
    if (extraUrl) command += ` "${extraUrl}"`;
    return runCMD(command);
  }
  else if (app.type === 'exe') {
    if (extraUrl) {
      return runCMD(`start "" "${app.path}" "${extraUrl}"`);
    } else {
      return runEXE(app.path);
    }
  }
}

const workspaces = {
  desarrollo: [
    () => resolveAndRun('vscode'),
    () => resolveAndRun('spotify'),
    () => resolveAndRun('opera', 'https://claude.ai')
  ],

  diseño: [
    () => resolveAndRun('opera', 'https://drive.google.com/drive/folders/1yxzTrjHkzU8UKrQROBgWd0Y28elALg8M'),
    () => resolveAndRun('opera', 'https://ssstik.io/es#google_vignette'),
    () => resolveAndRun('opera', 'https://www.tiktok.com'),
    () => resolveAndRun('capcut'),
    () => runCMD('explorer "C:\\Users\\jgec0\\Desktop\\DROP\\Productos\\-Recursos-"')
  ],

  radiante: [
    () => resolveAndRun('discord'),
    () => runCMD('start "" "C:\\Riot Games\\Riot Client\\RiotClientServices.exe"')
  ]
};

async function executeWorkspace(parameter, ws) {
  const key = Object.keys(workspaces).find(k =>
    k.toLowerCase() === (parameter || '').toLowerCase().trim()
  );

  if (!key) {
    return ws.send(JSON.stringify({
      status: 'error',
      message: `Workspace no encontrado: ${parameter}`
    }));
  }

  console.log(`[Workspace] INICIANDO: ${key}`);
  ws.send(JSON.stringify({ status: 'ok', message: `Iniciando workspace: ${key}` }));

  for (const step of workspaces[key]) {
    try {
      await step();
      await new Promise(r => setTimeout(r, 1600));
    } catch (err) {
      console.error(`[Workspace ERROR] en ${key}:`, err.message);
    }
  }

  ws.send(JSON.stringify({ status: 'ok', message: `Workspace ${key} completado` }));
  console.log(`[Workspace] ${key} FINALIZADO`);
}

module.exports = { executeWorkspace };