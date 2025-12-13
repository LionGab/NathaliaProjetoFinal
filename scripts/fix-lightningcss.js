const fs = require('fs');
const path = require('path');

// Fix for Windows: Copy lightningcss native binary to expected location
if (process.platform === 'win32' && process.arch === 'x64') {
  const sourceFile = path.join(
    __dirname,
    '..',
    'node_modules',
    'lightningcss-win32-x64-msvc',
    'lightningcss.win32-x64-msvc.node'
  );
  
  const destFile = path.join(
    __dirname,
    '..',
    'node_modules',
    'lightningcss',
    'lightningcss.win32-x64-msvc.node'
  );

  if (fs.existsSync(sourceFile) && !fs.existsSync(destFile)) {
    try {
      fs.copyFileSync(sourceFile, destFile);
      console.log('✅ LightningCSS fix aplicado: arquivo .node copiado para local esperado');
    } catch (error) {
      console.warn('⚠️  Aviso: Não foi possível copiar arquivo LightningCSS:', error.message);
    }
  }
}

