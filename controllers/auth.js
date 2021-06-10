const { response } = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const {generateJWT} = require('../helpers/jwt');

const newUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const emailExists = await User.findOne({ email });

        if(emailExists){
            return res.status(400).json({
                ok: false,
                message: 'That email is already registered'
            });
        }

        const user = new User(req.body);

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt);

        await user.save();

        // Create JWT

        const token = await generateJWT(user.id);

        return res.json({
            ok: true,
            user: user,
            token: token
        }); 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Please refer to the administrator'
        });
    }
}

const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const userDB = await User.findOne({ email });

        if( !userDB ){
            return res.status(404).json({
                ok: false,
                message: 'Email not found'
            });
        }

        // Validate password
        const validPassword = bcrypt.compareSync(password, userDB.password);

        if (!validPassword){
            return res.status(400).json({
                ok: false,
                message: 'The password is invalid'
            })
        }

        // Create JWT
        const token = await generateJWT(userDB.id);

        return res.json({
            ok: true,
            user: userDB,
            token: token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Please refer to the administrator'
        });
    }
}

const renewToken = async( req, res = response) => {
    
    const { uid } = req.uid;

    const newToken = await generateJWT(uid);

    try {
        
        const userDB = await User.findOne(uid);

        if( !userDB ){
            return res.status(404).json({
                ok: false,
                message: 'User not found'
            });
        }

        return res.json({
            ok: true,
            user: userDB,
            token: newToken
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Please refer to the administrator'
        });
    }
}

module.exports = {
    newUser,
    login,
    renewToken
}