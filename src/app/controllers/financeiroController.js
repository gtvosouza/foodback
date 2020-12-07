const express = require('express');

const Financeiro = require('../models/financeiro');
const Empresa = require('../models/empresa');
const configDB = require('../../config/database.json');
const authMiddlware  = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {
    try{        
        const { page, limit } = req.query;
        const skip = (page - 1) * configDB.pageLimit;
        
        const count = await  Financeiro.countDocuments({empresa : req.empresaID});
        
        let result = {
                        registros: await Financeiro.find({empresa : req.empresaID}).limit(5).sort({vencimento : -1}) ,
                        pages: Math.ceil(count / configDB.pageLimit)
                     };

        return res.send(result);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar registros'});
    }
});


router.get('/lancamento', async(req, res) => {
    try{        
        const { id } = req.query;
        
        const lancamento = await Financeiro.findById({_id: id});

        return res.send(lancamento);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar registros'});
    }
});

router.post('/', async(req, res) => {

    try{
        const { registros  } = req.body;
        
        await Financeiro.deleteMany({ sIdEmpresa: registros[0].sIdEmpresa });

        for (let i = 0; i < registros.length; i++) {
            const { sIdEmpresa } = registros[i];

            const empresa = await Empresa.findOne({ idSistema: sIdEmpresa });
            
            if (!!empresa){
                const financeiro = await Financeiro.create({...registros[i], empresa: empresa._id});

                await financeiro.save();                       
            }
        }

        return res.send({});

    }catch(err) {
        console.log(error)
        return res.status(400).send({ error: 'Registration failed'});
    }

});

module.exports = app => app.use('/financeiro', router);