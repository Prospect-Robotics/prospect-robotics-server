const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ID = require('../util').ID;

const blogPath = path.join(__dirname, '../data/blog.json');

router.post('/blog', (req, res) => {
  // if there are no photos, directly update the json
  if (req.files === null || Object.keys(req.files).length === 0) {
    let blogJson = JSON.parse(fs.readFileSync(blogPath, 'utf8')); // read json

    let id = req.body.id || ID();

    blogJson[id] = Object.assign(blogJson[id] || {}, { // assign new data
      id,
      title: req.body.title,
      date: req.body.date,
      content: req.body.content
    });

    fs.writeFileSync(blogPath, JSON.stringify(blogJson)); // write to file

    return res.status(200).send('No files were uploaded.');
  }

  // moving sent file into directory data/images/blog
  let file = req.files.file;
  file.mv(path.join(__dirname, `../data/images/blog/${req.body.fileName}`), function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    let blogJson = JSON.parse(fs.readFileSync(blogPath, 'utf8')); // read json

    let id = req.body.id || ID();
    blogJson[id] = { // assign new data
      id,
      src: '/blogImages/' + req.body.fileName,
      title: req.body.title,
      date: req.body.date,
      content: req.body.content
    };

    fs.writeFileSync(blogPath, JSON.stringify(blogJson)); // write to file

    res.send(blogJson[id]);
  });
});

router.delete('/blog/:id', (req, res) => {
  let blogJson = JSON.parse(fs.readFileSync(blogPath, 'utf8')); // read json
  delete blogJson[req.params.id]; // delete
  fs.writeFileSync(blogPath, JSON.stringify(blogJson)); // write to file;
  res.status(200).send();
});

router.get('/blogImages/', (req, res) => {
  res.sendFile(blogPath);
});

router.get('/blogImages/:imageName', function (req, res) {
  res.sendFile(path.join(__dirname, `../data/images/blog/${req.params.imageName}`));
});

module.exports = router;
