const { saveApp } = require('../utils/appResolver');

async function saveNewApp(parameter, ws) {
    const parts = parameter.split(' ');
    if (parts.length < 2) {
        return ws.send(JSON.stringify({ status: 'error', message: 'Formato: guardar app <nombre> <ruta>' }));
    }

    const name = parts[0];
    const pathOrCommand = parts.slice(1).join(' ');

    const isExe = pathOrCommand.includes('.exe') || pathOrCommand.includes('\\');

    saveApp(name, {
        type: isExe ? 'exe' : 'cmd',
        path: isExe ? pathOrCommand : undefined,
        command: !isExe ? pathOrCommand : undefined
    });

    ws.send(JSON.stringify({
        status: 'ok',
        message: `App "${name}" guardada correctamente`
    }));
}

module.exports = { saveNewApp };