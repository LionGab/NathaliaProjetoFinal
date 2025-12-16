/**
 * Script para limpar caches do projeto (Node.js - Cross-platform)
 * Uso: bun run clean
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

console.log("🧹 Limpando caches...");

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}

function removeFiles(pattern, baseDir = ".") {
  try {
    const files = fs.readdirSync(baseDir, { withFileTypes: true, recursive: true });
    let count = 0;
    for (const file of files) {
      if (file.isFile() && file.name.endsWith(pattern)) {
        try {
          fs.unlinkSync(path.join(file.path || baseDir, file.name));
          count++;
        } catch {
          // Ignore errors
        }
      }
    }
    return count;
  } catch {
    return 0;
  }
}

// Limpar cache do Expo
if (removeDir(".expo")) {
  console.log("🗑️  Removendo .expo...");
}

// Limpar cache do Metro (local)
if (removeDir(".metro-cache")) {
  console.log("🗑️  Removendo .metro-cache (local)...");
}

// Limpar cache global do Metro
const metroCacheGlobal = path.join(os.homedir(), ".metro-cache");
if (fs.existsSync(metroCacheGlobal)) {
  console.log("🗑️  Removendo ~/.metro-cache (global)...");
  if (removeDir(metroCacheGlobal)) {
    console.log("✅ Cache global removido");
  } else {
    console.log("⚠️  Não foi possível remover cache global (permissões insuficientes)");
    console.log(`   Execute manualmente: rm -rf ${metroCacheGlobal}`);
  }
}

// Limpar cache do node_modules
if (removeDir("node_modules/.cache")) {
  console.log("🗑️  Removendo node_modules/.cache...");
}

// Limpar TypeScript build info
const tsBuildInfoCount = removeFiles(".tsbuildinfo");
if (tsBuildInfoCount > 0) {
  console.log(`🗑️  Removendo ${tsBuildInfoCount} arquivo(s) .tsbuildinfo...`);
}

console.log("✅ Caches limpos!");
console.log("");
console.log("Execute: bun start --clear para reiniciar com cache limpo");

