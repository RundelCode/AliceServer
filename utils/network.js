const os = require('os');
const { spawn } = require('child_process');

function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return '127.0.0.1';
}

function execPromise(command, args = []) {
  return new Promise((resolve, reject) => {
    let child;

    try {
      if (typeof command === 'string' && command.toLowerCase().endsWith('.exe')) {
        child = spawn(command, args, {
          windowsHide: true
        });
      }

      else if (typeof command === 'string' && command.trim().startsWith('powershell')) {
        const script = command.replace(/^powershell\s+-Command\s+/, '').trim();

        child = spawn('powershell.exe', [
          '-Command',
          script
        ], {
          windowsHide: true
        });
      }

      else if (typeof command === 'string') {
        child = spawn('cmd.exe', [
          '/c',
          command
        ], {
          windowsHide: true
        });
      }

      else {
        return reject(new Error('Comando inválido'));
      }

      child.stdout?.on('data', (data) => {
        console.log('[CMD OUTPUT]', data.toString());
      });

      child.stderr?.on('data', (data) => {
        console.error('[CMD ERROR]', data.toString());
      });

      child.on('error', (err) => {
        console.error('[execPromise ERROR]', err);
        reject(err);
      });

      child.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Proceso terminó con código ${code}`));
        }
        resolve(code);
      });

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { getLocalIP, execPromise };