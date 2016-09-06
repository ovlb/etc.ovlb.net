const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const readFile = fs.readFile;
const dir = require('node-dir');
var md = require('markdown');

var readFilePromise = function(filename) {
  return new Promise(
    function(resolve, reject) {
      readFile(filename, 'utf8', (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
}

/* GET home page. */
router.get('/', (req, res, next) => {
  const artikelPath = path.join(process.cwd(), 'source/artikel/');
  var artikelMeta = [];

  /**
   * Read the contents of JSON files in the artikel folder. These contain the
   * metadata of the respective articles
   *
   * Sort them by date
   *
   * Render index template
   */
  dir.readFiles(artikelPath, {
    match: /.json$/
  }, (err, content, next) => {
    if (err) throw err;
    var parsed = JSON.parse(content);
    artikelMeta.push(parsed);
    // Index should show the articles in reversed chronological order
    artikelMeta.sort( (a, b) => {
      var dateA = new Date(a.sortDate);
      var dateB = new Date(b.sortDate);
      return dateB - dateA;
    });
    next();
  }, (err, files) => {
    if (err) throw err;
    res.render('index', {
      title: 'Start',
      artikel: artikelMeta
    });
  })
});

/**
 * GET single article
 */
router.get('/:artikel', (req, res, next) => {
  var dataObject = [];
  const artikel = req.params.artikel;

  // Construct paths to metadata and the Markdown files containing the text
  const data = artikel + '/data.json';
  const text = artikel + '/text.md';
  const pathToData = path.join(process.cwd(), 'source/artikel', data);
  const pathToText = path.join(process.cwd(), 'source/artikel', text);

  var textContent = fs.readFileSync(pathToText, 'utf8');

  /**
   * Parse the metadata, include the text and render the index page
   */
  readFilePromise(pathToData)
  .then(txt => {
    var parsedMeta = JSON.parse(txt);
    const locals = {
      title: parsedMeta.title,
      article: parsedMeta,
      text: md.parse(textContent)
    };

    if (req.query.js) {
      res.send(locals);
    }

    res.render('article', locals);
  })
  .catch(error => {
    console.log(error);
  });
});

module.exports = router;
