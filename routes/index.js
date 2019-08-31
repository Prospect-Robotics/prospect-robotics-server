const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const moment = require('moment');

const imagesDirectory = path.join(__dirname, '../data/images/members');
const membersPath = path.join(__dirname, '../data/members.json');

const blogPath = path.join(__dirname, '../data/blog.json');

const ID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

router.post('/upload', function (req, res) {
  if (req.files === null || Object.keys(req.files).length === 0) {
    let membersJson = JSON.parse(fs.readFileSync(membersPath, 'utf8'));

    Object.assign(membersJson.members[req.body.id], {
      name: req.body.name,
      position: req.body.position,
      description: req.body.description
    });

    if (req.body.position !== 'member')
      membersJson[req.body.position] = membersJson.members[req.body.id];

    fs.writeFileSync(membersPath, JSON.stringify(membersJson));

    return res.status(200).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let file = req.files.file;

  // Use the mv() method to place the file somewhere on your server
  file.mv(path.join(imagesDirectory, req.body.fileName), function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    let membersJson = JSON.parse(fs.readFileSync(membersPath, 'utf8'));

    let newId = ID();

    if (req.body.id !== undefined) {
      newId = req.body.id;
    }

    let member = {
      id: newId,
      name: req.body.name,
      src: '/memberImages/' + req.body.fileName,
      position: req.body.position,
      description: req.body.description
    };

    membersJson.members[newId] = member;

    if (member.position !== 'member')
      membersJson[member.position] = member;

    fs.writeFileSync(membersPath, JSON.stringify(membersJson));

    res.send(member);
  });
});

router.get('/memberImages', function (req, res) {
  res.sendFile(membersPath);
});

router.get('/memberImages/:imageName', function (req, res) {
  res.sendFile(path.join(imagesDirectory, req.params.imageName))
});

router.delete('/memberImages/:memberId', function (req, res) {
  let membersJson = JSON.parse(fs.readFileSync(membersPath, 'utf8'));

  let position = membersJson.members[req.params.memberId].position;
  if (position !== 'member' || position !== 'mentor')
    membersJson[position] = {};

  delete membersJson.members[req.params.memberId];

  fs.writeFileSync(membersPath, JSON.stringify(membersJson));

  res.status(200).send();
});

router.post('/blog', (req, res) => {
  // if there are no photos, directly update the json
  if (req.files === null || Object.keys(req.files).length === 0) {
    let blogJson = JSON.parse(fs.readFileSync(blogPath, 'utf8')); // read json

    let id = req.body.id || ID();

    blogJson[id] = Object.assign(blogJson[id] || {}, { // assign new data
      id,
      title: req.body.title,
      date: moment(req.body.date).milliseconds(),
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
      date: moment(req.body.date).milliseconds(),
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
