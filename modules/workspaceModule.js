const { execPromise } = require('../utils/network');

const workspaces = {
  'desarrollo': [
    () => execPromise('code'),
    () => execPromise('start spotify'),
    () => execPromise('start "" "C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe" "https://claude.ai"'),
  ],
};

async function executeWorkspace(parameter, ws) {
  const name = parameter.toLowerCase().trim();
  const steps = workspaces[name];

  if (!steps) {
    ws.send(JSON.stringify({ status: 'error', message: `Workspace no encontrado: ${name}` }));
    return;
  }

  ws.send(JSON.stringify({ status: 'ok', message: `Iniciando workspace: ${name}` }));

  for (const step of steps) {
    await step();
    await new Promise(r => setTimeout(r, 1500));
  }

  ws.send(JSON.stringify({ status: 'ok', message: `Workspace ${name} listo` }));
}

module.exports = { executeWorkspace };