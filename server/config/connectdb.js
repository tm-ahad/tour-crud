import config from './config.json' assert { type: "json" };
import mongoose from 'mongoose';

const connectdb = async () => {
   await mongoose.connect(config.dbconfig.dburi, {
      dbName: config.dbconfig.dbname
   })
};
export default connectdb;
