const express = require('express');
const jwt = require('jsonwebtoken');

const Auxiliar = require('../models/auxiliar');

const authMiddlware  = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {
    try{                
        const result =  await Funcao.find();
        
        return res.send(result);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar registros'});
    }
});

router.post('/', async(req, res) => {
    try{
        const { auxiliares  } = req.body;
        
        for (let i = 0; i < auxiliares.length; i++) {                   
            const auxiliar = await Auxiliar.create({...auxiliares[i]});

            await auxiliar.save();                       
        }

        return res.send({});

    }catch(err) {
        console.log(error)
        return res.status(400).send({ error: 'Registration failed'});
    }
});

module.exports = app => app.use('/auxiliares', router);