const express = require('express');
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();
app.set('json spaces', 4);

app.get('/', (req, res) => {
  res.send("Hello World!");
});

const URL = 'https://www.time.com';
let articles = [];
app.get('/getTimeStories', (req, res) => {
  (async () => {
    const response = await fetch(URL);
    const text = await response.text();
    const dom = await new JSDOM(text);
    dom.window.document.querySelectorAll('section.latest h2 a').forEach(el => {
      articles.push(({
        'title': el.textContent,
        'link': URL + el.getAttribute('href')}));
    });
    res.header("Content-Type",'application/json');
    res.json((articles));
  })()
})

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});