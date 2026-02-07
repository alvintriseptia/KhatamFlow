// Script to generate complete 604-page Madinah Mushaf metadata
// Uses AlQuran Cloud API to fetch comprehensive page data

import fs from 'fs';
import https from 'https';

const TOTAL_PAGES = 604;
const API_BASE = 'https://api.alquran.cloud/v1';

// Known Juz starting pages (standard Madinah Mushaf)
const juzPages = [
  1, 22, 42, 62, 82, 102, 122, 142, 162, 182,
  202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582
];

function getJuzForPage(page) {
  for (let i = juzPages.length - 1; i >= 0; i--) {
    if (page >= juzPages[i]) {
      return i + 1;
    }
  }
  return 1;
}

function fetchPage(pageNum) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}/page/${pageNum}/quran-uthmani`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.code === 200 && json.data && json.data.ayahs) {
            const ayahs = json.data.ayahs;
            const firstAyah = ayahs[0];
            const lastAyah = ayahs[ayahs.length - 1];

            // Extract all surahs on this page from the surahs object
            const surahsOnPage = json.data.surahs ?
              Object.values(json.data.surahs).map(s => ({
                number: s.number,
                name: s.englishName,
                transliteration: s.englishNameTranslation,
                revelationType: s.revelationType
              })) :
              [{
                number: firstAyah.surah.number,
                name: firstAyah.surah.englishName,
                transliteration: firstAyah.surah.englishNameTranslation,
                revelationType: firstAyah.surah.revelationType
              }];

            resolve({
              page: pageNum,
              surahs: surahsOnPage,
              juz: getJuzForPage(pageNum),
              startAyah: `${firstAyah.surah.number}:${firstAyah.numberInSurah}`,
              endAyah: `${lastAyah.surah.number}:${lastAyah.numberInSurah}`,
              isProstrationVerse: ayahs.some(a => a.sajda !== false)
            });
          } else {
            reject(new Error(`Invalid response for page ${pageNum}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function generateAllPages() {
  const pages = [];

  console.log('Fetching page data from AlQuran Cloud API...');
  console.log('This will take a few minutes (604 API calls)...\n');

  for (let i = 1; i <= TOTAL_PAGES; i++) {
    try {
      const pageData = await fetchPage(i);
      pages.push(pageData);

      if (i % 50 === 0) {
        console.log(`Progress: ${i}/${TOTAL_PAGES} pages fetched`);
      }

      // Rate limiting: wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error fetching page ${i}:`, error.message);
      // Add placeholder data if API fails
      pages.push({
        page: i,
        surahs: [{
          number: 0,
          name: "Unknown",
          transliteration: "Unknown",
          revelationType: "Unknown"
        }],
        juz: getJuzForPage(i),
        startAyah: "",
        endAyah: "",
        isProstrationVerse: false
      });
    }
  }

  console.log(`\nCompleted! Fetched ${pages.length} pages.`);

  const output = {
    type: "madinah",
    totalPages: 604,
    description: "Madinah Mushaf (King Fahd Complex) - 604 pages, 15 lines per page",
    generatedAt: new Date().toISOString(),
    pages
  };

  // Ensure directory exists
  const dir = './src/data/mushaf';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Save to JSON file
  const outputPath = `${dir}/madinah-604.json`;
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\nSaved to: ${outputPath}`);
  console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
}

// Run the generator
generateAllPages().catch(console.error);
