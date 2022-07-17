import mongoose from "mongoose";
import dateValidator from "../validators/dateValidator.js";

const { Schema, model } = mongoose;

let tourSchema = new Schema({
   title: {
      type: String,
      trim: true,
      minlength: [3, 'min length is 3'],
      maxlength: [20, 'max length is 20'],
      required: [true, 'title is required']
   },
   place: {
      type: String,
      required: true,
      required: [true, 'place is required']
   },
   date: {
      type: String,
      required: [true, 'date is required'],
      validator: {
         validate: dateValidator,
         message: 'Enter a valid date'
      }
   },
   image: String,
   description: {
      type: String,
      required: [true, 'description is required'],
      minlength: [100, 'desc min length is 100']
   }
})
tourSchema.pre('save', () => console.log('tour creating...'))
tourSchema.post('save', () => console.log('tour created'))
tourSchema.pre('remove', () => console.log('tour deleting...'))
tourSchema.post('remove',  () => console.log('tour deleted'))
tourSchema.pre('updateOne', () => console.log('tour updating...'))
tourSchema.post('updateOne', () => console.log('tour updated'))
let Tour = model('user', tourSchema);
let p = { Tour, tourSchema }
export default p;