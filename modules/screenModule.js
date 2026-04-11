const { execFile } = require('child_process');

function captureScreen(parameter, ws) {
  const psScript = `
    Add-Type -AssemblyName System.Windows.Forms;
    Add-Type -AssemblyName System.Drawing;

    $screen = [System.Windows.Forms.Screen]::PrimaryScreen;
    $bitmap = New-Object System.Drawing.Bitmap($screen.Bounds.Width, $screen.Bounds.Height);
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap);

    $graphics.CopyFromScreen($screen.Bounds.Location, [System.Drawing.Point]::Empty, $screen.Bounds.Size);

    $ms = New-Object System.IO.MemoryStream;
    $bitmap.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png);

    $graphics.Dispose();
    $bitmap.Dispose();

    [Convert]::ToBase64String($ms.ToArray());
  `;

  execFile(
    'powershell.exe',
    ['-NoProfile', '-Command', psScript],
    { maxBuffer: 20 * 1024 * 1024 },
    (err, stdout, stderr) => {
      if (err) {
        ws.send(JSON.stringify({ status: 'error', message: err.message }));
        return;
      }

      if (stderr) {
        ws.send(JSON.stringify({ status: 'error', message: stderr }));
        return;
      }

      const image = stdout.trim();

      if (!image) {
        ws.send(JSON.stringify({ status: 'error', message: 'Imagen vacía' }));
        return;
      }

      ws.send(JSON.stringify({
        status: 'screenshot',
        image
      }));

      console.log('[ScreenModule] Screenshot enviado');
    }
  );
}

module.exports = { captureScreen };