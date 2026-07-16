const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  { name: 'hero.jpg', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200' },
  { name: 'soft-seatings.jpg', url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=600' },
  { name: 'seatings.jpg', url: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=600' },
  { name: 'tables.jpg', url: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=600' },
  { name: 'storage.jpg', url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600' },
  { name: 'bedroom.jpg', url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600' },
  { name: 'rugs.jpg', url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600' },
  { name: 'perspective-green.jpg', url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800' },
  { name: 'perspective-yellow.jpg', url: 'https://images.unsplash.com/photo-1583847268964-b28ce8f30e9b?auto=format&fit=crop&q=80&w=800' },
  { name: 'perspective-peach.jpg', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
  { name: 'bottom-banner.jpg', url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1600' },
];

const dir = path.join(__dirname, 'public', 'assets', 'design-ideas');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function downloadAll() {
  for (const img of images) {
    const dest = path.join(dir, img.name);
    console.log(`Downloading ${img.name}...`);
    try {
      await download(img.url, dest);
      console.log(`Downloaded ${img.name}`);
    } catch (e) {
      console.error(`Failed to download ${img.name}: ${e.message}`);
    }
  }
  console.log('All downloads completed!');
}

downloadAll();
