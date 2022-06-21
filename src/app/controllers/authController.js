const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const authConfig = require('../../config/auth.json');
const User = require('../models/usuario');

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
    const { email, password } = req.body;
  
    const user = await User.findOne({ email }).select('+senha');
    
    if (!user)
        return res.status(400).send({ error: 'Usuário não encontrado'});

    if (!await bcrypt.compare(password, user.senha))
        return res.status(400).send({ error: 'Senha inválida'});

    user.senha = undefined;

    const accessToken = generateToken({ id: user._id  });
    
    res.send({ user, 
        accessToken,
             });
});


module.exports = app => app.use('/auth', router);