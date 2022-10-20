const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')

require('dotenv').config();

const User = require('../../models/User');

function generateToken(user) {
    return jwt.sign(
        {
        id: user.id,
        email: user.email,
        username: user.username
        },
        process.env.JWT,
        { expiresIn: '1h' }
    );
}

module.exports = {
    Mutation:{
        async login(_,{username, password}){
            const {errors, valid} = validateLoginInput(username, password);
            const user = await User.findOne({username});

            if(!valid){
                throw new UserInputError('Errors', {errors});
            }

            if(!user) {
                errors.general = "Cet utilisateur n'existe pas";
                throw new UserInputError("Cet utilisateur n'existe pas", {errors});
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = "Mauvaises informations";
                throw new UserInputError("Mauvaises informations", {errors});
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },

        async register(_, {registerInput:{username, email, password, confirmPassword}}){
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', {errors});
            }
            const user = await User.findOne({ username });
        if (user) {
            throw new UserInputError('Nom déjà utilisé', {
                errors: {
                    username: 'Nom déjà utilisé'
                }
            });
        }

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}