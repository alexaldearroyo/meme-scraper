import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const url = 'https://memegen-link-examples-upleveled.netlify.app';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchImages() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status.toString()}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const imgElements = [...document.querySelectorAll('img')];
    const imgSources = imgElements.map((img) => img.src);

    const randomImgSources = shuffleArray(imgSources).slice(0, 10);

    console.log(randomImgSources);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchImages();
