const jwtSecret = 'your_jwt_secret'; // Has to be same key as used in JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // local passport file

/**
 * Generates a JWT token for a user object
 * @param {*} user 
 * @returns JWT token
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // username to be encoded in JWT
        expiresIn: '7d', // expiration in 7 days
        algorithm: 'HS256' // algorithm to be used to "sign" or encode the values of the JWT
    });
}

/**
 * Makes a POST request in /login endpoint to login user and returns user and JWT token
 * @param {*} router 
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', {session: false}, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, {session: false}, (error) => {
                if(error){
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({user, token});
            });
        })(req, res);
    });
}