import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const schema = new Schema({
   token: String
});
const sessionModel = model('session', schema);
export default sessionModel;