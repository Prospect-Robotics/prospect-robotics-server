const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const imagesDirectory = path.join(__dirname, '../images/members');

const ID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

router.post('/upload', function (req, res) {
  if (req.files === null || Object.keys(req.files).length === 0) {
    let membersFile = fs.readFileSync(path.join(imagesDirectory, '../members.json'));
    let membersJson = JSON.parse(membersFile);

    Object.assign(membersJson.members[req.body.id], {
      name: req.body.name,
      position: req.body.position,
      description: req.body.description
    });

    if (req.body.position !== 'member')
      membersJson[req.body.position] = membersJson.members[req.body.id];

    fs.writeFileSync(path.join(imagesDirectory, '../members.json'), JSON.stringify(membersJson));

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

    let membersFile = fs.readFileSync(path.join(imagesDirectory, '../members.json'));
    let membersJson = JSON.parse(membersFile);

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

    fs.writeFileSync(path.join(imagesDirectory, '../members.json'), JSON.stringify(membersJson));

    res.send(member);
  });
});

router.get('/memberImages', function (req, res) {
  res.sendFile(path.join(imagesDirectory, '../members.json'));
});

router.get('/memberImages/:imageName', function (req, res) {
  res.sendFile(path.join(imagesDirectory, req.params.imageName))
});

router.delete('/memberImages/:memberId', function (req, res) {
  let membersFile = fs.readFileSync(path.join(imagesDirectory, '../members.json'));
  let membersJson = JSON.parse(membersFile);

  if (membersJson.members[req.params.memberId].position !== 'member')
    membersJson[membersJson.members[req.params.memberId].position] = {};

  delete membersJson.members[req.params.memberId];

  fs.writeFileSync(path.join(imagesDirectory, '../members.json'), JSON.stringify(membersJson));

  res.status(200).send();
});

router.post('/memberImages/:position', function (req, res) {
  let membersFile = fs.readFileSync(path.join(imagesDirectory, '../members.json'));
  let membersJson = JSON.parse(membersFile);

  console.log(req.body.name);

  res.status(200).send();
});

module.exports = router;
