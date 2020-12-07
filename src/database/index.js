const mongoose = require('mongoose');

const configMongo = require('../config/database.json');

mongoose.Promise = global.Promise;

mongoose.connect(configMongo.mongodb_url, { useCreateIndex: true,
                                            useNewUrlParser: true,
                                            useUnifiedTopology: true})
        .then(() => { console.log('mongoDB is connected...')  })
        .catch((err) => {throw err});

module.exports = mongoose;