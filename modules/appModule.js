const { execFile } = require('child_process');

const runCmd = (command) => {
  return execFile('cmd.exe', ['/c', command], { windowsHide: true });
};

const appMap = {
  chrome: {
    exe: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: []
  },

  spotify: {
    cmd: 'start "" spotify'
  },

  youtube: {
    cmd: 'start "" "C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe" https://youtube.com'
  },

  vscode: {
    exe: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
    args: []
  },

  opera: {
    exe: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
    args: []
  },

  discord: {
    cmd: 'start "" discord'
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

  if (app.cmd) {
    runCmd(app.cmd);

    ws.send(JSON.stringify({
      status: 'ok',
      message: `${parameter} abierto`
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