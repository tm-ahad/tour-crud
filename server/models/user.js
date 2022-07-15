import mongoose from "mongoose";
import validator from "validator";
import p from './tour.js';

const { tourSchema } = p

const { Schema, model } = mongoose

let schema = new Schema({
   name: {
      type: [String, 'name must be a string'],
      trim: true,
      minlength: [3, 'min length is 3'],
      maxlength: [20, 'max length is 20'],
      required: [true, 'name is required'],
   },
   age: {
      type: [Number, 'age must be a number'],
      min: [3, 'min age is 3'],
      maxl: [80, 'max age is 80'],
      required: [true, 'age is required'],
   },
   email: {
      type: String,
      trim: true,
      minlength: [3, 'min length is 3'],
      maxlength: [50, 'max length is 20'],
      required: [true, 'email is required'],
      unique: [true, 'email is unique'],
      validate: {
         validator: function (value) {
            return validator.isEmail(value);
         },
         message: 'Enter a valid email address'
      }
   },
   password: {
      type: [String, 'password must be a string'],
      minlength: [8, 'min length of password is 8'],
      unique: [true, 'password is unique']
   },
   accountname: {
      type: [String, 'accountname must be a string'],
      trim: true,
      minlength: [5, 'min length is 5'],
      maxlength: [50, 'max length is 50'],
   },
   Tours: [tourSchema]
})

schema.pre('save', () => console.log('doc saving...'));
schema.post('save', doc => {
   console.log('1 doc saved succsessfully');
   console.table(doc);
});

let User = model('User', schema);

export default User