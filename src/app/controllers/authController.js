const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth.json');
const User = require('../models/user');
const { Console } = require('console');

const router = express.Router();

function generateToken(params = {}){
    
    return token = jwt.sign(params, authConfig.secret, {
        expiresIn: 43200,        
    });
}

router.post('/register', async(req, res) => {
    try{
        const { email } = req.body;

        if(await User.findOne({ email })) 
            return res.status(400).send({ error: 'User already exists'});

        const user = await User.create(req.body);
        let token = '';

        user.password = undefined;
        
        return res.send({ user,
                          token,   
                        });

    }catch(err) {
        return res.status(400).send({ error: 'Registration failed'});
    }
});

router.post('/authenticate', async (req, res) =>  {
    const { email, password, idEmpresa } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user)
        return res.status(400).send({ error: 'User not found'});

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid Password'});

    user.password = undefined;

    const accessToken = generateToken({ id: user.id  });
  
    res.send({ user, 
        accessToken,
             });
});


module.exports = app => app.use('/auth', router);