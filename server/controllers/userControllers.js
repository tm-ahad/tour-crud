import User from '../models/user.js';
import bcrypt from 'bcrypt';
import config from '../config/config.json' assert {type: 'json'};
import tokenizer from '../auth/auth.js';

const userController = {
   register: async function({ body, app }, res){
        (Object.keys(body).length === 0) ? res.status(404).send(body) : (async () => {
            bcrypt.hash(body.password, config.jwt.hashrounds, (err, hashedPassword) => {
               err ? (() => { throw err }): (() => {
                  body.password = hashedPassword;
                  User.create(body)
                     .then(() => {
                        let token = tokenizer(body);
                        res.status(201).send(`User created: ${token}`);
                     })
               })()
            });
        })()

   },
   login: async function({ body: {email, password, accepts} }, res){
      const hash = await bcrypt.hash(password, config.jwt.hashrounds);
      let findedUser = User.findOne({ email, password: hash });

      findedUser ? res.status(200).send('Login success') :
         !findedUser.email ? res.status(204).send('Invalid email') :
         !findedUser.password ? res.status(204).send('Invalid password') :
         res.status(500).send('something wrong. sorry for that');
   }
};

export default userController;
