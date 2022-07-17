import jwt from 'jsonwebtoken';
import tokenizer from "../auth/auth.js";
import p from "../models/tour.js";
import User from "../models/user.js";

const { Tour } = p;

const tourController = {
   findAll: async ({ cookies }, res) => {
      res.status(200).send(jwt.decode(cookies.token).Tours);
   },
   bookTour: async ({ cookies, body: {title, place, date, description, image} }, res) => {
      let tour = new Tour({ title, place, date, description, image })
      if (!cookies.token){
         res.status(400).send('Please login😒🤨');
      } else {
         const user = jwt.decode(cookies.token);
         const dbObj = {...user};
         delete dbObj.iat;
         delete dbObj.exp;
         await User.findOneAndUpdate({email: user.email}, {...dbObj, Tours: [...dbObj.Tours, tour]});
         await User.findOne({ email: user.email }, (err, findedUser) => {
            cookies.token = tokenizer(findedUser);
         });
         res.status(201).send('Tour created on user succsessfully👌!');
      }
   },
   cancelTour: async ({ body: { id }, cookies }, res) => {
      if (!cookies.token){
         res.status(400).send('Please login😒🤨');
      } else {
         const { email } = jwt.decode(cookies.token);
         User.findOne({ email }, (err, findedUser) => {
            cookies.token = tokenizer(JSON.parse(JSON.stringify(findedUser)));
         });
         User.findOne({ email }).updateOne({}, { 
            $pull: { Tours: { _id: id } }
         }).then(() => res.status(200).send('Tour deleted😎'))
      }
   },
   updateTour: async ({ body: { index, update }, cookies }, res) => {
      if (!cookies.token){
         res.status(400).send('Please login😒🤨');
      } else {
         const { email } = jwt.decode(cookies.token);
         User.findOne({ email }, {}, {}, (err, doc) => {
            if (err){
               throw err;
            } else {
               const { name, age, email, password, accountName, Tours: userTours } = doc;
               userTours[index] = new Tour(update);
               User.findOne({ email }).updateOne({ 
                  name,
                  age, 
                  email,
                  password,
                  accountName, 
                  Tours: userTours
               }).then(() => {
                  User.findOne({ email }, (err, findedUser) => {
                     cookies.token = tokenizer(JSON.parse(JSON.stringify(findedUser)));
                  });
                  res.status(200).send('Tour updated succsessfully👍!');
            });
            }
      })
      }
   },
};
export default tourController;