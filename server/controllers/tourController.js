import User from "../models/user.js";
import p from "../models/tour.js";

const { Tour } = p

const tourController = {
   bookTour({ app, user, body: {title, place, date, description, image} }, res){
      Tour.create({ title, place, date, description, image})
         .then(() => {
            user.update(new User({ name: user.populate('name') }));
            res.status(201).send('tour booked successfully');
         }).catch(err => console.log(err.message));
   },
   cancelTour({ body: { id } }, { status }){
      let user = User.findOne(app.get('user'));
      let { name, age, email, accountname, password, tours } = user;
      Tour.deleteOne({ _id: id })
      status(201).send('tour booked successfully');
   },
   updateTour({ body: { id, update } }){
      let user = User.findOne(app.get('user'));
      let { name, age, email, accountname, password, tours } = user;
      Tour.findOneAndUpdate({ _id : id }, update)
      status(201).send('tour booked successfully');
   },
};
export default tourController;