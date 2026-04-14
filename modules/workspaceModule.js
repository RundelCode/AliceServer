const { runCMD, runEXE } = require('../utils/runner');

const workspaces = {
  desarrollo: [
    () => runEXE('C:\\Users\\jgec0\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe'),
    () => runCMD('start spotify:'),
    () => runCMD('start chrome "https://claude.ai"')
  ],

  diseño: [
    () => runCMD('start chrome "https://drive.google.com/drive/folders/1yxzTrjHkzU8UKrQROBgWd0Y28elALg8M"'),
    () => runCMD('start chrome "https://ssstik.io/es#google_vignette"'),
    () => runCMD('start chrome "https://www.tiktok.com"'),
    () => runEXE('C:\\Users\\jgec0\\AppData\\Local\\CapCut\\Apps\\CapCut.exe'),
    () => runCMD('start "" "C:\\Users\\jgec0\\AppData\\Local\\scalboost_browser\\Scalboost Browser.exe"'),
    () => runCMD('explorer "C:\\Users\\jgec0\\Desktop\\DROP\\Productos\\-Recursos-"')
  ],

  radiante: [
    () => runCMD('start "" "%LocalAppData%\\Discord\\Update.exe" --processStart "Discord.exe"'),
    () => runCMD('start "" "C:\\Riot Games\\Riot Client\\RiotClientServices.exe"')
  ],

  'limpieza del sistema': [
    async () => {
      console.log('[Limpieza] Iniciando limpieza controlada del sistema...');
      await safeKillAll();
      await cleanSystem();
      await freeMemory();
      await new Promise(r => setTimeout(r, 4000));
      await restartExplorer();
      console.log('[Limpieza] Finalizada correctamente');
    }
  ]
};

const KEEP_PROCESSES = [
  'explorer', 'svchost', 'lsass', 'wininit', 'services', 'csrss', 'smss',
  'dllhost', 'conhost', 'sihost', 'taskhostw', 'RuntimeBroker', 'Antimalware',
  'discord', 'DiscordPTB', 'DiscordCanary', 'Code', 'Scalboost', 'Scalboost Browser',
  'pm2', 'pm2-runtime', 'alice-server', 'node'
];

const safeKillAll = () => runCMD(`powershell -Command "Get-Process | Where-Object { $_.ProcessName -notmatch '${KEEP_PROCESSES.join('|')}' } | Stop-Process -Force -ErrorAction SilentlyContinue"`);

const cleanSystem = async () => {
  await runCMD('del /q/f/s %TEMP%\\* 2>nul');
  await runCMD('del /q/f/s C:\\Windows\\Temp\\* 2>nul');
  await runCMD('ipconfig /flushdns');
  console.log('[Limpieza] Temporales y DNS limpiados');
};

const freeMemory = async () => {
  await runCMD('powershell -Command "[System.GC]::Collect()"');
  console.log('[Limpieza] Memoria liberada');
};

const restartExplorer = async () => {
  await runCMD('taskkill /IM explorer.exe /F');
  await new Promise(r => setTimeout(r, 1200));
  await runCMD('start "" explorer.exe');
  console.log('[Limpieza] Explorer reiniciado');
};

async function executeWorkspace(parameter, ws) {
  const key = Object.keys(workspaces).find(k =>
    k.toLowerCase() === (parameter || '').toLowerCase().trim()
  );

  if (!key) {
    return ws.send(JSON.stringify({ status: 'error', message: `Workspace no encontrado: ${parameter}` }));
  }

  console.log(`[Workspace] INICIANDO: ${key}`);
  ws.send(JSON.stringify({ status: 'ok', message: `Iniciando workspace: ${key}` }));

  for (let i = 0; i < workspaces[key].length; i++) {
    console.log(`[Workspace] Paso ${i + 1}/${workspaces[key].length} → ejecutando...`);

    try {
      await workspaces[key][i]();
      console.log(`[Workspace] Paso ${i + 1} → completado correctamente`);
    } catch (err) {
      console.error(`[Workspace ERROR] Paso ${i + 1} en ${key}:`, err.message);
    }

    await new Promise(r => setTimeout(r, 1800));
  }

  ws.send(JSON.stringify({ status: 'ok', message: `Workspace ${key} completado` }));
  console.log(`[Workspace] ${key} FINALIZADO`);
}

module.exports = { executeWorkspace };