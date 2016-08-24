const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const readFile = fs.readFile;
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
  res.locals.title = 'Start';
  res.render('index');
});

router.get('/:artikel', (req, res, next) => {
  var dataObject = [];
  const artikel = req.params.artikel;

  const data = artikel + '/data.json';
  const text = artikel + '/text.md';

  const pathToData = path.join(process.cwd(), 'source/artikel', data);
  const pathToText = path.join(process.cwd(), 'source/artikel', text);

  var textContent = fs.readFileSync(pathToText, 'utf8');

  readFilePromise(pathToData)
  .then(txt => {
    var parsedText = JSON.parse(txt);
    res.locals.title = parsedText.title;
    res.locals.article = parsedText;
    res.locals.text = textContent;
    res.locals.md = md;
    res.render('article');
  })
  .catch(error => {
    console.log(error);
  });
});

module.exports = router;
