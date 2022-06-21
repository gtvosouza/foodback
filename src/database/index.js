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

//const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}/?authSource=admin`; 


const url = `mongodb+srv://doadmin:M2cj6m4R180lYA37@foodback-mongodb-307866dd.mongo.ondigitalocean.com/admin?authMechanism=DEFAULT`; 

//const url = `mongodb://localhost/db_teste`; 

mongoose.Promise = global.Promise;

mongoose.connect(url, options).then( function() {
        console.log('MongoDB is connected');
      })
        .catch( function(err) {
        console.log(err);
      });
      

module.exports = mongoose;
