const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;

const db = new Sequelize(
  process.env.PORT || 'postgres://localhost:5432/acme_people_places_things'
);

const Person = db.define('person', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Place = db.define('places', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Thing = db.define('things', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Purchase = db.define('purchases', {
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
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
    const [purch1, purch2, purch3] = await Promise.all(
      [
        [5, '9/13/1994', moe, nyc, foo],
        [7, '5/8/1994', lucy, la, quq],
        [9, '12/7/2019', larry, nyc, bazz],
      ].map(
        ([amount, date, person, place, thing]) =>
          new Purchase({
            amount: amount,
            date: date,
            personId: person.id,
            placeId: place.id,
            thingId: thing.id,
          })
      )
    );
    await Promise.all([purch1.save(), purch2.save(), purch3.save()]);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  syncAndSeed,
  models: { Person, Place, Thing, Purchase },
};
