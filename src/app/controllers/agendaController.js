const express = require('express');

const Agenda = require('../models/agenda');
const authMiddlware  = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {
    try{                
        return res.send(await Agenda.find());       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar registros'});
    }
});


router.post('/', async(req, res) => {
    try{
        const { agendas  } = req.body;

        for (let i = 0; i < agendas.length; i++) {
            const agenda = await Agenda.create({...agendas[i]});

            await agenda.save();     
        }

        return res.send({});

    }catch(err) {
        console.log(error)
        return res.status(400).send({ error: 'Registration failed'});
    }

});

module.exports = app => app.use('/agenda', router);