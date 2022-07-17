import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const schema = new Schema({
   token: String
});
const historyModel = model('history', schema);
export default historyModel;