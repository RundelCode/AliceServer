const os = require('os');
const { exec } = require('child_process');

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

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
      if (stdout) console.log('[CMD OUTPUT]', stdout);
      if (stderr) console.error('[CMD ERROR]', stderr);

      if (err) {
        console.error('[execPromise ERROR]', err);
        return reject(err);
      }

      resolve();
    });
  });
}

module.exports = { getLocalIP, execPromise };