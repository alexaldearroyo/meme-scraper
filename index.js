import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const url = 'https://memegen-link-examples-upleveled.netlify.app';
const outputFolder = path.join(process.cwd(), 'memes');

// Ensure the output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Downloads a single image
const downloadImage = async (imageUrl, filepath) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const fileStream = fs.createWriteStream(filepath);
  response.body.pipe(fileStream);
  await new Promise((resolve, reject) => {
    response.body.on('end', resolve);
    response.body.on('error', reject);
  });
};

// Fetches html from url and downloads images
const fetchImages = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const imgElements = Array.from(document.getElementsByTagName('img'));
    const limitedImgSources = imgElements.map((img) => img.src).slice(0, 10);

    for (const [index, src] of limitedImgSources.entries()) {
      const imageUrl = src.startsWith('http') ? src : `${url}${src}`;
      const imageFile = path.join(
        outputFolder,
        `${(index + 1).toString().padStart(2, '0')}.jpg`,
      );

      console.log(`Downloading: ${imageUrl} -> ${imageFile}`);
      await downloadImage(imageUrl, imageFile);
    }

    console.log('\nAll images downloaded successfully.');
  } catch (error) {
    console.error('Error:', error.message);
  }
};

await fetchImages().catch((error) => {
  console.error('Error:', error.message);
});
