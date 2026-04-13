const fs = require('fs');

const knownApps = {
  vscode: {
    type: 'exe',
    path: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe'
  },

  opera: {
    type: 'exe',
    path: 'C:\\Users\\jgec0\\AppData\\Local\\Programs\\Opera GX\\opera.exe'
  },

  capcut: {
    type: 'exe',
    path: 'C:\\Users\\jgec0\\AppData\\Local\\CapCut\\Apps\\CapCut.exe'
  },

  spotify: {
    type: 'cmd',
    command: 'start "" spotify'
  },

  discord: {
    type: 'cmd',
    command: 'start "" discord'
  },

  youtube: {
    type: 'cmd',
    command: 'start "" opera https://youtube.com'
  }
};

function resolveApp(name) {
  const key = name.toLowerCase().trim();
  const app = knownApps[key];

  if (!app) return null;

  if (app.type === 'exe' && !fs.existsSync(app.path)) {
    return null;
  }

  return app;
}

module.exports = { resolveApp };