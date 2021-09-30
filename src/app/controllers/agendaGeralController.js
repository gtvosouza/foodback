const express = require('express');

const Agenda = require('../models/agendaGeral');
const Empresa = require('../models/empresa');
const authMiddlware  = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {
    try{        
        const { page, limit } = req.query;
        const skip = (page - 1) * 10;
        
        const count = await  Agenda.countDocuments({empresa : req.empresaID});
        
        let result = {
            agendas:  !!limit ? await Agenda.find({empresa : req.empresaID}).limit(5) : await Agenda.find({empresa : req.empresaID}).limit(configDB.pageLimit).skip(skip),
                        pages: Math.ceil(count / 10)
                     };

        return res.send(result);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar registros'});
    }
});


router.post('/', async(req, res) => {
    try{
        const { agendas  } = req.body;

        for (let i = 0; i < agendas.length; i++) {
            const { sIdEmpresa } = agendas[i];

            const empresa = await Empresa.findOne({ idSistema: sIdEmpresa });
         
            if (!!empresa){
                const agenda = await Agenda.create({...agendas[i], empresa: empresa._id});

                await agenda.save();                       
            }
        }

        return res.send({});

    }catch(err) {
        console.log(error)
        return res.status(400).send({ error: 'Registration failed'});
    }

});

module.exports = app => app.use('/agenda', router);