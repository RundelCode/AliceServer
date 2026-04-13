const { execFile } = require('child_process');

function runCMD(command) {
  return new Promise((resolve, reject) => {
    execFile('cmd.exe', ['/c', command], { windowsHide: true }, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = { runCMD };