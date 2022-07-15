import config from './config.json' assert { type: "json" };
import mongoose from 'mongoose';

const connectdb = async () => {
   let connect = mongoose.connect(config.dbconfig.dburi, {
      dbName: config.dbconfig.dbname
   });
   mongoose.connection.on('connected', () => console.log('mongoose connected'));
   mongoose.connection.on('error', err => {
      console.log(`Error occured: ${err}\nmongoose reconnecting...`);
      connect.then(() => console.log('Mongoose reconnected'));
   });
   mongoose.connection.on('disconnected', () => {
      console.log(`mongoose disconnected\nmongoose reconnecting...`);
      connect.then(() => console.log('Mongoose reconnected'));
   });
};
export default connectdb;
