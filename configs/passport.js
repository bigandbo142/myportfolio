const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('../configs/keys')
const User = require('../models/User')

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.tokenSecretKey
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findOne({email: jwt_payload.email})
                .then(user => {
                    if(user) done(null, user)
                    else done(null, false)
                })
                .catch(err => console.log(err))
        })
    )
}