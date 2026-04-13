const { exec } = require('child_process');

function runCMD(command) {
    console.log(`[RUN CMD] Ejecutando: ${command}`);

    return new Promise((resolve, reject) => {
        exec(command, { windowsHide: true, shell: true }, (err, stdout, stderr) => {
            if (stdout) console.log(`[CMD STDOUT] ${stdout}`);
            if (stderr) console.error(`[CMD STDERR] ${stderr}`);

            if (err) {
                console.error(`[RUN CMD ERROR] ${err.message}`);
                return reject(err);
            }
            resolve();
        });
    });
}

function runEXE(path, args = []) {
    console.log(`[RUN EXE] Ejecutando: ${path} ${args.join(' ')}`);

    return new Promise((resolve, reject) => {
        const { execFile } = require('child_process');
        execFile(path, args, { windowsHide: true }, (err) => {
            if (err) {
                console.error(`[RUN EXE ERROR] ${err.message}`);
                return reject(err);
            }
            resolve();
        });
    });
}

module.exports = { runCMD, runEXE };