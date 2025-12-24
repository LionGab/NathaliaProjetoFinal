#!/usr/bin/env node
/**
 * Script para baixar os Reels mais populares da Nathália
 * Baseado na análise do Instagram
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "assets", "onboarding", "videos");

// Top Reels identificados no Instagram (ordenados por visualizações)
const TOP_REELS = [
  {
    id: "DSNbzm7Dsbw",
    url: "https://www.instagram.com/reel/DSNbzm7Dsbw/",
    views: "20,4 mi",
    priority: 1,
    filename: "reel-top-1-20mi.mp4",
  },
  {
    id: "DSQmzyokjbr",
    url: "https://www.instagram.com/reel/DSQmzyokjbr/",
    views: "14,6 mi",
    priority: 1,
    filename: "reel-top-2-14mi.mp4",
  },
  {
    id: "DSNuuyGDhvR",
    url: "https://www.instagram.com/reel/DSNuuyGDhvR/",
    views: "12,9 mi",
    priority: 1,
    filename: "reel-top-3-12mi.mp4",
  },
  {
    id: "DSNVNAYDjYt",
    url: "https://www.instagram.com/reel/DSNVNAYDjYt/",
    views: "12,9 mi",
    priority: 2,
    filename: "reel-top-4-12mi.mp4",
  },
  {
    id: "DSLIGdHDL57",
    url: "https://www.instagram.com/reel/DSLIGdHDL57/",
    views: "16 mi",
    priority: 1,
    filename: "reel-top-5-16mi.mp4",
  },
  {
    id: "DSTaWyrDuZP",
    url: "https://www.instagram.com/reel/DSTaWyrDuZP/",
    views: "11,4 mi",
    priority: 2,
    filename: "reel-top-6-11mi.mp4",
  },
  {
    id: "DSWH40QDhdW",
    url: "https://www.instagram.com/reel/DSWH40QDhdW/",
    views: "10,3 mi",
    priority: 2,
    filename: "reel-top-7-10mi.mp4",
  },
  {
    id: "DSM9MboDB58",
    url: "https://www.instagram.com/reel/DSM9MboDB58/",
    views: "10,5 mi",
    priority: 2,
    filename: "reel-top-8-10mi.mp4",
  },
  {
    id: "DSKoH1vjr8d",
    url: "https://www.instagram.com/reel/DSKoH1vjr8d/",
    views: "10,4 mi",
    priority: 2,
    filename: "reel-top-9-10mi.mp4",
  },
  {
    id: "DSiMcSBjEXU",
    url: "https://www.instagram.com/reel/DSiMcSBjEXU/",
    views: "9,8 mi",
    priority: 1,
    filename: "reel-top-10-9mi.mp4",
  },
];

async function downloadReel(reel) {
  const outputPath = path.join(OUTPUT_DIR, reel.filename);

  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Já existe: ${reel.filename} (${reel.views})`);
    return true;
  }

  try {
    console.log(`\n📥 Baixando: ${reel.filename} (${reel.views})`);
    console.log(`   URL: ${reel.url}`);

    execSync(
      `yt-dlp "${reel.url}" -o "${outputPath}" -f "best[ext=mp4]/best" --no-playlist --quiet --progress`,
      { stdio: "inherit" }
    );

    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`✅ Baixado: ${reel.filename} (${sizeMB} MB)\n`);
      return true;
    }
  } catch (error) {
    console.log(`❌ Erro ao baixar ${reel.filename}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("🎬 Download dos Top Reels da Nathália\n");
  console.log("=" .repeat(60));

  // Criar diretório
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Verificar yt-dlp
  try {
    execSync("yt-dlp --version", { stdio: "ignore" });
  } catch {
    console.log("❌ yt-dlp não encontrado. Instale com: brew install yt-dlp");
    process.exit(1);
  }

  // Baixar Reels prioritários primeiro
  const priority1 = TOP_REELS.filter((r) => r.priority === 1);
  const priority2 = TOP_REELS.filter((r) => r.priority === 2);

  console.log(`\n📋 Baixando ${priority1.length} Reels prioritários (top 5)...\n`);

  for (const reel of priority1) {
    await downloadReel(reel);
  }

  console.log(`\n📋 Baixando ${priority2.length} Reels adicionais...\n`);

  for (const reel of priority2) {
    await downloadReel(reel);
  }

  // Resumo
  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Resumo:\n");

  const downloaded = TOP_REELS.filter((reel) => {
    const filePath = path.join(OUTPUT_DIR, reel.filename);
    return fs.existsSync(filePath);
  });

  console.log(`✅ Baixados: ${downloaded.length}/${TOP_REELS.length}`);
  downloaded.forEach((reel) => {
    const filePath = path.join(OUTPUT_DIR, reel.filename);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`   • ${reel.filename} (${sizeMB} MB) - ${reel.views}`);
  });

  const missing = TOP_REELS.filter((reel) => {
    const filePath = path.join(OUTPUT_DIR, reel.filename);
    return !fs.existsSync(filePath);
  });

  if (missing.length > 0) {
    console.log(`\n❌ Faltando: ${missing.length}`);
    missing.forEach((reel) => {
      console.log(`   • ${reel.filename} - ${reel.url}`);
    });
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { TOP_REELS, downloadReel };

