const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const APPS_FILE = path.join(DATA_DIR, 'apps.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(APPS_FILE)) {
        fs.writeFileSync(APPS_FILE, JSON.stringify({}, null, 2));
    }
}

function loadApps() {
    ensureDataDir();
    try {
        return JSON.parse(fs.readFileSync(APPS_FILE, 'utf8'));
    } catch {
        return {};
    }
}

function resolveApp(name) {
    const key = name.toLowerCase().trim();
    const apps = loadApps();

    if (apps[key]) return apps[key];

    console.log(`[Resolver] "${name}" no encontrado → usando fallback`);
    return {
        type: 'cmd',
        command: `start "" ${key}`
    };
}

function saveApp(name, config) {
    const apps = loadApps();
    apps[name.toLowerCase().trim()] = config;
    fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2));
    console.log(`[Resolver] Nueva app guardada: ${name}`);
}

module.exports = { resolveApp, saveApp, ensureDataDir };