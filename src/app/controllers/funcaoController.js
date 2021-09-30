const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth.json');

const Funcao = require('../models/funcao');
const Empresa = require('../models/empresa');
const authMiddlware  = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {
    try{        
        const { page, limit } = req.query;
        const skip = (page - 1) * 10;
        
        const count = await  Funcao.countDocuments({empresa : req.empresaID});
        
        let result = {
                        funcoes:  !!limit ? await Funcao.find({empresa : req.empresaID}).limit(5).sort({qtdeFuncionarios : -1}) : await Funcao.find({empresa : req.empresaID}).limit(configDB.pageLimit).skip(skip).sort({qtdeFuncionarios : -1}),
                        pages: Math.ceil(count / 10)
                     };

        return res.send(result);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar registros'});
    }
});


router.get('/byname', async(req, res) => {
    try{        
        const { nome } = req.query;
        
        const funcao = await Funcao.findOne({ empresa : req.empresaID, nome });

        return res.send(funcao);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar registros'});
    }
});


router.post('/', async(req, res) => {
    try{
        const { funcoes  } = req.body;
        
        await Funcao.deleteMany({ sIdEmpresa: funcoes[0].sIdEmpresa });

        for (let i = 0; i < funcoes.length; i++) {
            const { sIdEmpresa } = funcoes[i];

            const empresa = await Empresa.findOne({ idSistema: sIdEmpresa });
         
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