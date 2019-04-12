const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://peng21:anqiwang@cluster0-qa242.mongodb.net/test?retryWrites=true'
  , { useNewUrlParser: true })
    .then(client => {
    _db = client.db("");
      console.log('Connected!');
      callback(client);
    })
    .catch(err => {
      console.log(err); 
    });
};

 const getDb = ()=>{
     if(_db){
         return _db;
     }
 }

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;