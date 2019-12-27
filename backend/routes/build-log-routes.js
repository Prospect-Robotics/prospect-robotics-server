const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ID = require('../util').ID;

const buildLogPath = path.join(__dirname, '../data/build-log.json');

router.post('/buildLog', (req, res) => {
  // if there are no photos, directly update the json
  if (req.files === null || Object.keys(req.files).length === 0) {
    let buildLogJson = JSON.parse(fs.readFileSync(buildLogPath, 'utf8')); // read json

    let id = req.body.id || ID();

    buildLogJson[id] = Object.assign(buildLogJson[id] || {}, { // assign new data
      id,
      title: req.body.title,
      date: req.body.date,
      content: req.body.content
    });

    fs.writeFileSync(buildLogPath, JSON.stringify(buildLogJson)); // write to file

    return res.status(200).send('No files were uploaded.');
  }

  // moving sent file into directory data/images/build-log
  let file = req.files.file;
  file.mv(path.join(__dirname, `../data/images/build-log/${req.body.fileName}`), function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    let buildLogJson = JSON.parse(fs.readFileSync(buildLogPath, 'utf8')); // read json

    let id = req.body.id || ID();
    buildLogJson[id] = { // assign new data
      id,
      src: '/buildLogImages/' + req.body.fileName,
      title: req.body.title,
      date: req.body.date,
      content: req.body.content
    };

    fs.writeFileSync(buildLogPath, JSON.stringify(buildLogJson)); // write to file

    res.send(buildLogJson[id]);
  });
});

router.delete('/buildLog/:id', (req, res) => {
  let buildLogJson = JSON.parse(fs.readFileSync(buildLogPath, 'utf8')); // read json
  delete buildLogJson[req.params.id]; // delete
  fs.writeFileSync(buildLogPath, JSON.stringify(buildLogJson)); // write to file;
  res.status(200).send();
});

router.get('/buildLogImages/', (req, res) => {
  res.sendFile(buildLogPath);
});

router.get('/buildLogImages/:imageName', function (req, res) {
  res.sendFile(path.join(__dirname, `../data/images/build-log/${req.params.imageName}`));
});

module.exports = router;
