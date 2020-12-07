const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth.json');

const Funcao = require('../models/funcao');
const Empresa = require('../models/empresa');
const configDB = require('../../config/database.json');
const authMiddlware  = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {
    try{        
        const { page, limit } = req.query;
        const skip = (page - 1) * configDB.pageLimit;
        
        const count = await  Funcao.countDocuments({empresa : req.empresaID});
        
        let result = {
                        funcoes:  !!limit ? await Funcao.find({empresa : req.empresaID}).limit(5).sort({qtdeFuncionarios : -1}) : await Funcao.find({empresa : req.empresaID}).limit(configDB.pageLimit).skip(skip).sort({qtdeFuncionarios : -1}),
                        pages: Math.ceil(count / configDB.pageLimit)
                     };

        return res.send(result);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar registros'});
    }
});


router.post('/', async(req, res) => {
    try{
        const { funcoes  } = req.body;
        console.log('aaaa');

        for (let i = 0; i < funcoes.length; i++) {
            const { idEmpresa } = funcoes[i];

            const empresa = await Empresa.findOne({ idSistema: idEmpresa });
         
            if (!!empresa){
                const funcao = await Funcao.create({...funcoes[i], empresa: empresa._id});

                await funcao.save();                       
            }
        }

        return res.send({});

    }catch(err) {
        console.log(error)
        return res.status(400).send({ error: 'Registration failed'});
    }
});

module.exports = app => app.use('/funcoes', router);