const Sequelize = require('sequelize');
const { STRING, INTEGER, DATE } = Sequelize;

const db = new Sequelize(
  process.env.PORT || 'postgres://localhost/acme_people_places_things'
);

const Person = db.define('person', {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

const Place = db.define('places', {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

const Thing = db.define('things', {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

const Purchase = db.define('purchases', {
  amount: {
    type: INTEGER,
    allowNull: false,
  },
  date: {
    type: DATE,
    allowNull: false,
  },
});

Purchase.belongsTo(Person);
Purchase.belongsTo(Place);
Purchase.belongsTo(Thing);
Person.hasMany(Purchase);
Place.hasMany(Purchase);
Thing.hasMany(Purchase);

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });
    const [moe, lucy, larry] = await Promise.all(
      ['moe', 'lucy', 'larry'].map((person) => new Person({ name: person }))
    );
    const [nyc, chicago, la, dallas] = await Promise.all(
      ['NYC', 'Chicago', 'LA', 'Dallas'].map(
        (place) => new Place({ name: place })
      )
    );
    const [foo, bar, bazz, quq] = await Promise.all(
      ['foo', 'bar', 'bazz', 'quq'].map((thing) => new Thing({ name: thing }))
    );
    await Promise.all([
      moe.save(),
      lucy.save(),
      larry.save(),
      nyc.save(),
      chicago.save(),
      la.save(),
      dallas.save(),
      foo.save(),
      bar.save(),
      bazz.save(),
      quq.save(),
    ]);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  syncAndSeed,
  models: { Person, Place, Thing, Purchase },
};
