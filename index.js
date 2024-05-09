import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const url = 'https://memegen-link-examples-upleveled.netlify.app';
const outputFolder = path.join(process.cwd(), 'memes');

// Shuffles web images
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Downloads a single image
const downloadImage = async (imageUrl, filepath) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const buffer = await response.buffer();
  fs.writeFileSync(filepath, buffer);
};

// Fetches html from url
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

    // Limits the number of img sources to 10
    const randomImgSources = shuffleArray(imgSources).slice(0, 10);

    // Prints all img sources
    console.log(randomImgSources);

    // Create output folder
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    // Download images
    for (const [index, src] of randomImgSources.entries()) {
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
