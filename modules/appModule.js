const { execFile } = require('child_process');

const appMap = {
  chrome: {
    exe: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: []
  },
  spotify: {
    exe: 'C:\\Users\\jgec0\\AppData\\Roaming\\Spotify\\Spotify.exe',
    args: []
  },
  youtube: {
    exe: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
    args: ['https://youtube.com']
  },
  vscode: {
    exe: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
    args: []
  },
  opera: {
    exe: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
    args: []
  }
};

function openApp(parameter, ws) {
  const key = parameter?.toLowerCase().trim();
  const app = appMap[key];

  if (!app) {
    ws.send(JSON.stringify({
      status: 'error',
      message: `App no encontrada: ${parameter}`
    }));
    return;
  }

  execFile(app.exe, app.args, { windowsHide: true }, (err) => {
    if (err) {
      console.error(err);
      ws.send(JSON.stringify({
        status: 'error',
        message: err.message
      }));
      return;
    }

    ws.send(JSON.stringify({
      status: 'ok',
      message: `${parameter} abierto`
    }));
  });
}

module.exports = { openApp };