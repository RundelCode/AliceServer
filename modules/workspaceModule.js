const { execPromise } = require('../utils/network');

const runCmd = (command) => execPromise(`cmd.exe /c ${command}`);

const apps = {
  vscode: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
  opera: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
  scalboost: 'C:\\Users\\jgec0\\AppData\\Local\\scalboost_browser\\Scalboost Browser.exe',
  capcut: 'C:\\Users\\jgec0\\AppData\\Local\\CapCut\\Apps\\CapCut.exe',
  spotify: 'C:\\Users\\jgec0\\AppData\\Local\\Microsoft\\WindowsApps\\Spotify.exe'
};

const workspaces = {
  desarrollo: [
    () => execPromise(`"${apps.vscode}"`),
    () => runCmd(`start "" "${apps.spotify}"`),
    () => runCmd(`start "" "${apps.opera}" https://claude.ai`)
  ],

  diseño: [
    () => runCmd(`start "" "${apps.opera}" https://drive.google.com/drive/folders/1yxzTrjHkzU8UKrQROBgWd0Y28elALg8M`),
    () => execPromise(`"${apps.capcut}"`),
    () => runCmd(`explorer.exe "C:\\Users\\jgec0\\Desktop\\DROP\\Productos\\-Recursos-"`)
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

const KILL_LIST = [
  'chrome',
  'opera',
  'spotify',
  'code',
  'capcut'
];

const safeKillAll = () => execPromise(`powershell.exe -Command "
Get-Process | Where-Object {
  $name = $_.ProcessName.ToLower()
  (${KILL_LIST.map(p => `$name -like '*${p}*'`).join(' -or ')})
} | Stop-Process -Force"
`);

const cleanSystem = async () => {
  await runCmd('del /q/f/s %TEMP%\\*');
  await runCmd('del /q/f/s C:\\Windows\\Temp\\*');
  await runCmd('del /q/f/s C:\\Windows\\Prefetch\\*');
  await runCmd('ipconfig /flushdns');
  await execPromise('powershell.exe -Command "Clear-RecycleBin -Force"');
};

const freeMemory = async () => {
  await execPromise(`powershell.exe -Command "[System.GC]::Collect(); Start-Sleep -Milliseconds 200; [System.GC]::WaitForPendingFinalizers();"`);
};

const restartExplorer = async () => {
  await runCmd('taskkill /IM explorer.exe /F');
  await runCmd('start "" explorer.exe');
};

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\b(el|la|los|las|de|del)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function executeWorkspace(parameter, ws) {
  const input = normalize(parameter);

  const key = Object.keys(workspaces).find(k =>
    normalize(k) === input
  );

  if (!key) {
    ws.send(JSON.stringify({
      status: 'error',
      message: `Workspace no encontrado: ${parameter}`
    }));
    return;
  }

  const steps = workspaces[key];

  ws.send(JSON.stringify({
    status: 'ok',
    message: `Iniciando workspace: ${key}`
  }));

  for (const step of steps) {
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