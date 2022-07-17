import User from "../models/user.js";
import p from "../models/tour.js";
import jwt from 'jsonwebtoken';
import tokenizer from "../auth/auth.js";

const { Tour } = p;

const tourController = {
   bookTour: async ({ cookies, body: {title, place, date, description, image} }, res) => {
      let tour = new Tour({ title, place, date, description, image })
      const user = jwt.decode(cookies.token);
      const dbObj = {...user};
      delete dbObj.iat;
      delete dbObj.exp;
      await User.findOneAndUpdate({email: user.email}, {...dbObj, Tours: [...dbObj.Tours, tour]})
      res.status(201).send('Tour created on user succsessfully');
      await User.findOne({ email: user.email }, (err, findedUser) => {
         cookies.token = tokenizer(findedUser);
      });
   },
   cancelTour: async ({ body: { id }, cookies }, res) => {
      const { email } = jwt.decode(cookies.token);
      User.findOne({ email }).updateOne({}, { 
         $pull: { Tours: { _id: id } }
       }).then(() => res.status(200).send('Tour deleted😎'))
       User.findOne({ email }, (err, findedUser) => {
         cookies.token = tokenizer(JSON.parse(JSON.stringify(findedUser)));
      });
   },
   updateTour: async ({ body: { index, update }, cookies }, res) => {
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
            }).then(() => res.status(200).send('Op!'));
         }
      })
   },
};
export default tourController;