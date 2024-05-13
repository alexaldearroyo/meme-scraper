import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const url = 'https://memegen-link-examples-upleveled.netlify.app';
const outputFolder = path.join(process.cwd(), 'memes');

// Downloads a single image
const downloadImage = async (imageUrl, filepath) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const buffer = await response.buffer();
  fs.writeFileSync(filepath, buffer);
};

// Fetches html from url and downloads images
const fetchImages = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const html = await response.text();

    // Parses data into a DOM
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Selects all img elements
    const imgElements = [...document.querySelectorAll('img')];
    const imgSources = imgElements.map((img) => img.src);

    // Limits the number of image sources to 10
    const limitedImgSources = imgSources.slice(0, 10);

    // Prints all image sources
    console.log(limitedImgSources);

    // Downloads images
    for (const [index, src] of limitedImgSources.entries()) {
      const imageUrl = src.startsWith('http') ? src : `${url}${String(src)}`;
      const imageFile = path.join(outputFolder, `meme${index + 1}.jpg`);
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
export { default } from 'eslint-config-upleveled';
