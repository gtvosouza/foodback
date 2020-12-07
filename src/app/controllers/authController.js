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
        expiresIn: 86400,        
    });
}

router.post('/register', async(req, res) => {
    try{
        const { email, sIdEmpresa } = req.body;

        if(await User.findOne({ email })) 
            return res.status(400).send({ error: 'User alreadSy exists'});

        const user = await User.create(req.body);
        let token = '';

        if (sIdEmpresa > 0)
           token = generateToken({ id: user.id, empresa: user.empresa._id })

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

    const user = await User.findOne({ email }).select('+password').populate('empresa');

    if (!user)
        return res.status(400).send({ error: 'User not found'});

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid Password'});

    user.password = undefined;

    let token;

    if (!!user.empresa)
        token = generateToken({ id: user.id, empresa: user.empresa._id  });
    else 
        token = generateToken({ id: user.id  });
        
    res.send({ user, 
               token,
             });
});

router.post('/forgot_password', async(req, res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({ email });
            
        if (!user)
            return res.status(400).send({ error: 'User not found'});

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();        
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: 'gtvosouza@gmail.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'Cannot send forgot password email'});

            return res.send();
        })

    }catch (err){
        res.status(400).send({ error: 'Error on forgot password, try again'})
    }
})

router.post('/reset_password', async(req, res) => {
    const { email, token, password} = req.body;

    try{
        const user = await User.findOne({email})
            .select('+passwordResetToken passwordResetExpires');

        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' });
        
        const now = new Date();
        
        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate a new one' });

        user.password = password;
        
        console.log( password)

        await user.save();

        res.send();

    }catch (err){
        return res.status(400).send({ error: 'Cannot reset passord, try again'})
    }
})

module.exports = app => app.use('/auth', router);