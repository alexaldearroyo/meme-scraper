// scrap https://memegen-link-examples-upleveled.netlify.app

// - connect to https://memegen-link-examples-upleveled.netlify.app
// -- fetch the html

import https from 'node:https';
import { JSDOM } from 'jsdom';

const url = 'https://memegen-link-examples-upleveled.netlify.app';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

https
  // Fetches html from url
  .get(url, (res) => {
    let data = '';

    // Gets data in parts
    res.on('data', (chunk) => {
      data += chunk;
    });

    // Processes data once response is finished
    res.on('end', () => {
      // Parses data into a DOM
      const dom = new JSDOM(data);
      const document = dom.window.document;

      // Selects all img elements
      const imgElements = [...document.querySelectorAll('img')];
      const imgSources = imgElements.map((img) => img.src);

      const randomImgSources = shuffleArray(imgSources).slice(0, 10);

      console.log(randomImgSources); // Prints all img sources

      // console.log(data); // Outputs fetched data (html)
    });
  })
  .on('error', (err) => {
    console.error('Error:', err.message);
  });
