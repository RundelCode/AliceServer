const { runCMD, runEXE } = require('../utils/runner');
const { resolveApp } = require('../utils/appResolver');

const workspaces = {
  desarrollo: [
    () => runEXE('C:\\Users\\jgec0\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe'),
    () => runCMD('start "" spotify'),
    () => runCMD('start "" opera https://claude.ai')
  ],

  diseño: [
    () => runCMD('start "" opera https://drive.google.com'),
    () => runEXE('C:\\Users\\jgec0\\AppData\\Local\\CapCut\\Apps\\CapCut.exe'),
    () => runEXE('explorer.exe', ['C:\\Users\\jgec0\\Desktop\\DROP\\Productos\\-Recursos-'])
  ],

  'reinicio del sistema': [
    async () => {
      await safeKillAll();
      await cleanSystem();
      await freeMemory();
      await restartExplorer();
    }
  ]
};

const KILL_LIST = ['chrome', 'opera', 'spotify', 'code', 'capcut'];

const safeKillAll = () =>
  runCMD(`powershell -Command "Get-Process | Where-Object { ${KILL_LIST.map(p => `$_ .ProcessName -like '*${p}*'`).join(' -or ')} } | Stop-Process -Force"`);

const cleanSystem = async () => {
  await runCMD('del /q/f/s %TEMP%\\*');
  await runCMD('del /q/f/s C:\\Windows\\Temp\\*');
  await runCMD('del /q/f/s C:\\Windows\\Prefetch\\*');
  await runCMD('ipconfig /flushdns');
  await runCMD('powershell -Command "Clear-RecycleBin -Force"');
};

const freeMemory = async () => {
  await runCMD('powershell -Command "[System.GC]::Collect()"');
};

const restartExplorer = async () => {
  await runCMD('taskkill /IM explorer.exe /F');
  await runCMD('start "" explorer.exe');
};

function normalize(text) {
  return text.toLowerCase().trim();
}

async function executeWorkspace(parameter, ws) {
  const key = Object.keys(workspaces).find(k => normalize(k) === normalize(parameter));

  if (!key) {
    ws.send(JSON.stringify({
      status: 'error',
      message: `Workspace no encontrado: ${parameter}`
    }));
    return;
  }

  ws.send(JSON.stringify({
    status: 'ok',
    message: `Iniciando workspace: ${key}`
  }));

  for (const step of workspaces[key]) {
    try {
      await step();
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      console.error('[Workspace ERROR]', err);
    }
  }

  ws.send(JSON.stringify({
    status: 'ok',
    message: `Workspace ${key} listo`
  }));
}

module.exports = { executeWorkspace };