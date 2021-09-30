require('dotenv/config');

const mongoose = require('mongoose');

const {
        MONGO_USERNAME,
        MONGO_PASSWORD,
        MONGO_HOSTNAME,
        MONGO_PORT,
        MONGO_DB
} = process.env;
    
const options = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
};

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`; 

mongoose.Promise = global.Promise;

mongoose.connect(url, options).then( function() {
        console.log('MongoDB is connected');
      })
        .catch( function(err) {
        console.log(err);
      });
      

module.exports = mongoose;
