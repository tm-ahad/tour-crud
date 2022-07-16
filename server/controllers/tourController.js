import User from "../models/user.js";
import p from "../models/tour.js";
import jwt from 'jsonwebtoken';

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
   },
   cancelTour: async ({ body: { id }, cookies }, res) => {
      const user = jwt.decode(cookies.token);
      const dbObj = {...user};
      delete dbObj.iat;
      delete dbObj.exp;
      delete dbObj.Tours;
      User.findOne({ email: user.email }).updateOne({}, { 
         $pull: { Tours: { _id: id } }
       }).then(() => res.status(200).send('Tour deleted😎'))
   },
   updateTour({ req, res }){
      const user = jwt.decode(cookies.token);
      this.cancelTour(req, res);
      this.bookTour(req, res);
      res.status(201).send('Tour updated on user succsessfully');
   },
};
export default tourController;