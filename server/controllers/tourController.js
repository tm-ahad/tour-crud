import User from "../models/user.js";
import p from "../models/tour.js";
import jwt from 'jsonwebtoken';

const { Tour } = p;

const tourController = {
   bookTour: async ({ app, cookies, body: {title, place, date, description, image} }, res) => {
      let tour = new Tour({ title, place, date, description, image })
      const user = jwt.decode(cookies.token);
      const dbObj = {...user};
      delete dbObj.iat;
      delete dbObj.exp;
      await User.findOneAndUpdate({email: user.email}, {...dbObj, Tours: [...dbObj.Tours, tour]})
      res.status(201).send('Tour created on user succsessfully');
   },
   cancelTour({ body: { id } }, { status }){
      const user = jwt.decode(cookies.token);
      User.findOneAndUpdate(user, new User({ 
         name: user.name,
         age: user.age,
         email: user.email,
         password: user.passwors,
         accountName: user.accountName,
         Tours: new Tour({})
       }));
      res.status(201).send('Tour deleted on user succsessfully');
   },
   updateTour({ body: { update } }){
      const user = jwt.decode(cookies.token);
      User.findOneAndUpdate(user, new User({ 
         name: user.name,
         age: user.age,
         email: user.email,
         password: user.passwors,
         accountName: user.accountName,
         Tours: new Tour(update)
       }));
      res.status(201).send('Tour updated on user succsessfully');
   },
};
export default tourController;