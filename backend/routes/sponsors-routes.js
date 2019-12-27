const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ID = require('../util').ID;

const sponsorsPath = path.join(__dirname, '../data/sponsors.json');

router.get('/sponsors/', (req, res) => {
  res.sendFile(sponsorsPath);
});

router.post('/sponsors', (req, res) => {
  const writeData = () => {
    let sponsors = JSON.parse(fs.readFileSync(sponsorsPath, 'utf8')); // read json

    let id = req.body.id || ID();
    sponsors[id] = { // assign new data
      id,
      src: req.body.fileName ? '/sponsors/' + req.body.fileName : sponsors[id].src,
      year: req.body.year,
      name: req.body.name,
      description: req.body.description
    };

    fs.writeFileSync(sponsorsPath, JSON.stringify(sponsors)); // write to file

    res.send(sponsors[id]);
  };

  // if there are no photos, directly update the json
  if (req.files === null || Object.keys(req.files).length === 0) {
    writeData()
  }

  // moving sent file into directory data/images/sponsors
  let file = req.files.file;
  file.mv(path.join(__dirname, `../data/images/sponsors/${req.body.fileName}`), function (err) {
    if (err) { // throw if there was an error
      console.log(err);
      return res.status(500).send(err);
    }

    writeData();
  });
});

router.delete('/sponsors/:id', (req, res) => {
  let sponsorsJson = JSON.parse(fs.readFileSync(sponsorsPath, 'utf8')); // read json
  delete sponsorsJson[req.params.id]; // delete
  fs.writeFileSync(sponsorsPath, JSON.stringify(sponsorsJson)); // write to file;
  res.status(200).send();
});

router.get('/sponsors/:imageName', (req, res) => {
  res.sendFile(path.join(__dirname, `../data/images/sponsors/${req.params.imageName}`));
});

module.exports = router;
