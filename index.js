// scrap https://memegen-link-examples-upleveled.netlify.app

// - connect to https://memegen-link-examples-upleveled.netlify.app
// -- fetch the html

import https from 'https';

const url = 'https://memegen-link-examples-upleveled.netlify.app';

https
  .get(url, (res) => {
    // fetches html
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(data); // Shows fetched data (html)
    });
  })
  .on('error', (err) => {
    console.error('Error:', err.message);
  });
