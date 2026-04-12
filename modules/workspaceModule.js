const { execPromise } = require('../utils/network');

const apps = {
  vscode: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
  opera: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
  scalboost: 'C:\\Users\\jgec0\\AppData\\Local\\scalboost_browser\\Scalboost Browser.exe',
  capcut: 'C:\\Users\\jgec0\\AppData\\Local\\CapCut\\Apps\\CapCut.exe',
  spotify: 'C:\\Users\\jgec0\\AppData\\Roaming\\Spotify\\Spotify.exe'
};


const workspaces = {

  desarrollo: [
    () => execPromise(apps.vscode),
    () => execPromise('start spotify'),
    () => execPromise(apps.opera, ['https://claude.ai']),
  ],

  diseño: [
    () => execPromise(apps.opera, [
      'https://drive.google.com/drive/folders/1yxzTrjHkzU8UKrQROBgWd0Y28elALg8M',
      'tiktok.com',
      'https://ssstik.io/es#google_vignette'
    ]),
    () => execPromise(apps.scalboost),
    () => execPromise(apps.capcut),
    () => execPromise('explorer.exe', [
      'C:\\Users\\jgec0\\Desktop\\DROP\\Productos\\-Recursos-'
    ]),
  ],

  'reinicio del sistema': [
    async () => {
      console.log('[SYSTEM] Iniciando limpieza total...');

      await safeKillAll();

      await cleanSystem();

      await freeMemory();

      await restartExplorer();

      console.log('[SYSTEM] Sistema optimizado');
    }
  ]
};


const SAFE_PROCESSES = [
  'explorer',
  'cmd',
  'powershell',
  'node',
  'System',
  'Idle',
  'winlogon',
  'csrss',
  'services',
  'lsass',
  'svchost',
  'spoolsv',
  'fontdrvhost',
  'dwm',
  'SearchIndexer',
  'discord'
];


const safeKillAll = () => execPromise(
  `powershell -Command "Get-Process | Where-Object {
    $name = $_.ProcessName.ToLower()
    -not (${SAFE_PROCESSES.map(p => `$name -eq '${p}'`).join(' -or ')})
  } | Stop-Process -Force"`
);


const cleanSystem = async () => {
  console.log('[SYSTEM] Limpiando temporales...');

  await execPromise('del /q/f/s %TEMP%\\*');
  await execPromise('del /q/f/s C:\\Windows\\Temp\\*');

  console.log('[SYSTEM] Limpiando Prefetch...');
  await execPromise('del /q/f/s C:\\Windows\\Prefetch\\*');

  console.log('[SYSTEM] Limpiando DNS...');
  await execPromise('ipconfig /flushdns');

  console.log('[SYSTEM] Limpiando papelera...');
  await execPromise('powershell -Command "Clear-RecycleBin -Force"');
};


const freeMemory = async () => {
  console.log('[SYSTEM] Liberando memoria...');

  await execPromise(
    `powershell -Command "[System.GC]::Collect(); Start-Sleep -Milliseconds 200; [System.GC]::WaitForPendingFinalizers();"`
  );
};


const restartExplorer = async () => {
  console.log('[SYSTEM] Reiniciando explorer...');
  await execPromise('taskkill /IM explorer.exe /F');
  await execPromise('start explorer.exe');
};


async function executeWorkspace(parameter, ws) {
  const name = parameter?.toLowerCase().trim();
  const steps = workspaces[name];

  if (!steps) {
    ws.send(JSON.stringify({
      status: 'error',
      message: `Workspace no encontrado: ${name}`
    }));
    return;
  }

  ws.send(JSON.stringify({
    status: 'ok',
    message: `Iniciando workspace: ${name}`
  }));

  for (const step of steps) {
    try {
      console.log('[Workspace] Ejecutando paso...');
      await step();

      await new Promise(r => setTimeout(r, 800));

    } catch (err) {
      console.error('[Workspace ERROR]', err);
    }
  }

  ws.send(JSON.stringify({
    status: 'ok',
    message: `Workspace ${name} listo`
  }));
}

module.exports = { executeWorkspace };