import JWT from "jsonwebtoken"
import config from "../config/config.json" assert {type: 'json'}

const tokenizer = user => {
   return JWT.sign(user, config.jwt.secretkey, {
      expiresIn: config.jwt.expiresin,
   })
}
export default tokenizer;