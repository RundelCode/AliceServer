const { exec } = require('child_process');

const appMap = {
  chrome: 'start chrome',
  spotify: 'start spotify',
  whatsapp: 'start whatsapp',
  youtube: 'start "" "C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe" https://youtube.com',
  vscode: 'code',
  terminal: 'start cmd',
  opera: 'start "" "C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe"',
  claude: 'start "" "C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe" "https://claude.ai"',
};

function openApp(parameter, ws) {
  const cmd = appMap[parameter.toLowerCase().trim()];
  if (cmd) {
    exec(cmd, (err) => {
      if (err) {
        ws.send(JSON.stringify({ status: 'error', message: err.message }));
      } else {
        ws.send(JSON.stringify({ status: 'ok', message: `${parameter} abierto` }));
      }
    });
  } else {
    ws.send(JSON.stringify({ status: 'error', message: `App no encontrada: ${parameter}` }));
  }
}

module.exports = { openApp };