import User from "../models/user.js";
import Tour from "../models/tour.js";

const tourController = {
   bookTour({ app, body: {title, place, date, description, image, tour} }, { status }){
      let user = User.findOne(app.get('user'));
      user = User.create({title, place, date, description, image, tours: [...user.tours, Tour.create(tour)]});
      status(201).send('tour booked successfully');
   },
   cancelTour({ body: { id } }, { status }){
      let user = User.findOne(app.get('user'));
      let { name, age, email, accountname, password, tours } = user;
      Tour.deleteOne({ _id: id })
      user = { name, age, email, accountname, password, tours: tours.filter(tour => tour === user.findOne({ _id: id }))}
      status(201).send('tour booked successfully');
   },
   updateTour({ body: { id, update } }){
      let user = User.findOne(app.get('user'));
      let { name, age, email, accountname, password, tours } = user;
      Tour.findOneAndUpdate({ _id : id }, update)
      user = { name, age, email, accountname, password, tours: [...tours.filter(val => val !== Tour.findOne({ _id: id })), new Tour(update)]}
      status(201).send('tour booked successfully');
   },
};
export default tourController;