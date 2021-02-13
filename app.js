const {
  syncAndSeed,
  models: { Person, Place, Thing, Purchase },
} = require('./db');
const express = require('express');

const app = express();

app.get('/', async (req, res, next) => {
  try {
    const people = await Person.findAll();
    const places = await Place.findAll();
    const things = await Thing.findAll();
    res.send(`${people}, ${places}, ${things}`);
  } catch (err) {
    next(err);
  }
});

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

init();
