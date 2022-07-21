import bcrypt from 'bcrypt';
import tokenizer from '../auth/auth.js';
import config from '../config/config.json' assert { type: 'json' };
import sessionModel from '../models/session.js';
import User from '../models/user.js';

const userController = {
   register: async function(req, res){
        let {body, accepts} = req;
        req.accepts(['text/json', 'application/json']);
        Object.keys(body).length === 0 ? (() => {
            res.status(404).send('No data found form user');
            console.log('No data found from user');
        })() : Object.keys(body).length !== 0 ? (async () => {
            bcrypt.hash(body.password, config.jwt.hashrounds, (err, hashedPassword) => {
               err ? (() => { throw err }): (() => {
                  body.password = hashedPassword;
                  User.create(body)
                     .then((doc) => {
                        req.user = doc
                        let token = tokenizer(body);
                        res.cookie('token', token)
                        res.status(201).send(`User created: ${token}`);
                     })
               })()
            });
        })(): (() => {
            res.status(500).send('Internal server error. sorry for that !');
            console.log('Internal server error. retrying to register...')
            this.register(req, res);
        })()

   },
   login: async function(req, res){
      let { body, accepts } = req;
      req.accepts(['text/json', 'application/json']);
      let { email, password } = body;
      var message = '';
      const hash = await bcrypt.hash(password, config.jwt.hashrounds)
                  .then(data => data)
                  .catch(err => {
                     console.log(err.message);
                     message = 'No password provided😠';
                  });
      const query = { email };
      User.findOne(query, async (err, findedUser) => {
         message && res.status(400).send(message.value);
         if (err){
            res.status(500).send('Internal server error😭!');
            throw err;
         } else {
            if (!findedUser){
               console.log('User not found');
               res.status(203).send('User not found😠!');
            } else {
               const token = tokenizer(JSON.parse(JSON.stringify(findedUser)))
               if (await bcrypt.compare(password, findedUser.password[0]) ){
                  console.log('Login success');
                  res.cookie('token', token);
                  let allDoc = await historyModel.find({});
                  await sessionModel.updateOne({ id: allDoc[0]._id }, {
                     token
                  });
                  res.status(200).send('Login success😎');
               } else {
                  res.status(400).send('Invalid Password😭');
               }  
            }
         }
      });
   },
   logout: async ({ cookies }, res) => {
      (async () => {
         cookies = {};
      }).then(() => res.status(200).send('Logout successfully'))
   }
};
export default userController;