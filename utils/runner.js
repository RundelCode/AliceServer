const { exec } = require('child_process');

function runCMD(command) {
  console.log(`[RUN CMD] Ejecutando → ${command}`);

  return new Promise((resolve, reject) => {
    const fullCommand = `start /B "" ${command}`;

    exec(fullCommand, { 
      windowsHide: true, 
      shell: true,
      timeout: 20000 
    }, (err, stdout, stderr) => {
      if (stdout) console.log(`[CMD STDOUT] ${stdout.trim()}`);
      if (stderr) console.error(`[CMD STDERR] ${stderr.trim()}`);

      if (err && err.killed !== true) {
        console.error(`[RUN CMD ERROR] ${err.message}`);
        return reject(err);
      }

      console.log(`[RUN CMD] → Finalizado: ${command}`);
      resolve();
    });
  });
}

function runEXE(path, args = []) {
  console.log(`[RUN EXE] Ejecutando → ${path} ${args.join(' ')}`);

  const command = `"${path}" ${args.join(' ')}`;
  return runCMD(command);
}

module.exports = { runCMD, runEXE };