const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth.json');

const Exame = require('../models/exame');
const Funcionario = require('../models/funcionario');
const configDB = require('../../config/database.json');
const authMiddlware  = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {
    
    try{ 
        const { page, nomeExame, startDate } = req.query;
        const skip = (page - 1) * configDB.pageLimit;

        let count = 0;

        let result;
        
        if(!!startDate){
            const date = new Date(startDate);
            const primeiroDia = new Date(date.getFullYear(), date.getMonth(), 1);
            const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            count = await  Exame.countDocuments({empresa : req.empresaID,
                                                proximoExame : { $gte : primeiroDia }, $and : [ { proximoExame : { $lte : ultimoDia } }],
                                                nomeExame :  !!nomeExame ? new RegExp(nomeExame, 'i') :new RegExp(' ') });

            result = {
            exames: await Exame.find({empresa : req.empresaID,
                                      proximoExame : { $gte : primeiroDia }, $and : [ { proximoExame : { $lte : ultimoDia } }],
                                      nomeExame :  !!nomeExame ? new RegExp(nomeExame, 'i') :new RegExp(' ') })
                               .populate('funcionario')
                               .limit(configDB.pageLimit)
                               .skip(skip),
            pages: Math.ceil(count / configDB.pageLimit)
         };

        }else {
            count = await  Exame.countDocuments({empresa : req.empresaID,
                                                nomeExame :  !!nomeExame ? new RegExp(nomeExame, 'i') :new RegExp(' ') });
            result = {
                exames: await Exame.find({empresa : req.empresaID,
                                          nomeExame :  !!nomeExame ? new RegExp(nomeExame, 'i') :new RegExp(' ')}).populate('funcionario').limit(configDB.pageLimit).skip(skip),
                pages: Math.ceil(count / configDB.pageLimit)
            };
        }

        return res.send(result);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar Empresas'});
    }
});

router.post('/', async(req, res) => {
    try{
        const { exames  } = req.body;
        
        for (let i = 0; i < exames.length; i++) {
            const { idFuncionario } = exames[i];
            console.log(exames[i]);
            const funcionario = await Funcionario.findOne({ idSistema: idFuncionario });
            
            if (!!funcionario){
                const exame = await Exame.create({...exames[i], funcionario: funcionario._id, empresa: funcionario.empresa._id});

                await exame.save();                       
            }
        }

        return res.send({});

    }catch(err) {
        console.log(error)
        return res.status(400).send({ error: 'Registration failed'});
    }
});

module.exports = app => app.use('/exames', router);