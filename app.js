const {
  syncAndSeed,
  models: { Person, Place, Thing, Purchase },
} = require('./db');
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(require('method-override')('_method'));
app.use(express.static('./assets'));

app.get('/', async (req, res, next) => {
  try {
    const people = await Person.findAll();
    const places = await Place.findAll();
    const things = await Thing.findAll();
    const purchases = await Purchase.findAll();
    res.send(`
      <html>
        <head>
          <link rel='stylesheet' href='styles.css' />
        </head>
        <body>
          <h1>People, Places, and Things with Dates</h1>
          <div>
            <div>
              <form method='POST' action='/?_method=POST'>
                <select name="person">
                  <option value="null">--- Person ---</option>
                  ${people.map(
                    (person) => `
                    <option value="${person.id}">${person.name}
                    </option>
                  `
                  )}
                </select>
                <select name="place">
                  <option>--- Places ---</option>
                  ${places.map(
                    (place) => `
                    <option value="${place.id}">${place.name}
                    </option>
                  `
                  )}
                </select>
                <select name="thing">
                  <option>--- Things ---</option>
                  ${things.map(
                    (thing) => `
                    <option value="${thing.id}">${thing.name}
                    </option>
                  `
                  )}
                </select>
                <input name="count" type="number" placeholder="count...">
                <input name="date" type="date">
                <input type="submit" value="Create Purchase"></input>
              </form>
              <div>
                ${purchases
                  .map(
                    (purchase) => `
                    <p>${people[purchase.personId - 1].name} purchased ${
                      purchase.amount
                    } ${things[purchase.thingId - 1].name} in ${
                      places[purchase.placeId - 1].name
                    } on ${
                      purchase.date.getMonth() + 1
                    }/${purchase.date.getDate()}/${purchase.date.getFullYear()}
                    <form method="POST" action="/?_method=DELETE"><button name="purchase" value ="${
                      purchase.id
                    }">X</button></form>
                    </p>
                `
                  )
                  .join('')}
              </div>
            </div>
            <div>
              <h2>People (${people.length})</h2>
              <ul>
                ${people
                  .map(
                    (person) => `
                  <li>
                    ${person.name}
                  </li>
                `
                  )
                  .join('')}
              </ul>
              <h2>Places (${places.length})</h2>
              <ul>
                ${places
                  .map(
                    (place) => `
                  <li>
                    ${place.name}
                  </li>
                `
                  )
                  .join('')}
              </ul>
              <h2>Things (${things.length})</h2>
              <ul>
                ${things
                  .map(
                    (thing) => `
                  <li>
                    ${thing.name}
                  </li>
                `
                  )
                  .join('')}
              </ul>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    next(err);
  }
});

app.post('/', async (req, res, next) => {
  try {
    const { person, place, thing, count, date } = req.body;
    const purchase = new Purchase({
      personId: person,
      placeId: place,
      thingId: thing,
      amount: count,
      date: date,
    });
    purchase.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

app.delete('/', async (req, res, next) => {
  try {
    const purchase = await Purchase.findByPk(req.body.purchase);
    await purchase.destroy();
    res.redirect('/');
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
