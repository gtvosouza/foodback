const express = require('express');
const router = express.Router();

const Funcionario = require('../models/funcionario');
const Exames = require('../models/exame');
const Agenda = require('../models/agenda');
const Financeiro = require('../models/financeiro');
const authMiddlware  = require('../middlewares/auth');
const Empresa = require('../models/empresa');

router.use(authMiddlware);

router.get('/', async(req, res) => {
    try{              
        const count = Funcionario.countDocuments({empresa : req.empresaID, dtDemissao : null} );
        const d = new Date();                
        d.setDate(-30);

        const empresa = await Empresa.findById({_id : req.empresaID});


        const financeiro = await Financeiro.aggregate([
                                    { $match: {sIdEmpresa : empresa.idSistema} },
                                    { $group: {_id : null, sum: {$sum:"$valor"}}}
                                ]);
        

        const dataAtual = new Date();
        
        let result = {
            funcionariosAtivos: 
            {
                atual:  (await Funcionario.countDocuments({empresa : req.empresaID, dtDemissao : null})).toString(),
                anterior: (await  Funcionario.countDocuments({empresa : req.empresaID, dtDemissao: {$ne:null}})).toString()
            },
            examesAtrasados:
            {
                total: (await  Exames.countDocuments({empresa : req.empresaID} )).toString(),
                atrasados: (await  Exames.countDocuments({empresa : req.empresaID, proximoExame :  { $lt : dataAtual } })).toString()
            },
            agendas:
            {
                total: (await Agenda.countDocuments({empresa : req.empresaID})).toString(),
                hoje: (await Agenda.countDocuments({empresa : req.empresaID, data: Date.now()})).toString()
            }
            //,
            //financeiro:
            //{
            //    valor: financeiro[0].sum,
            //    qtde: (await Financeiro.countDocuments({empresa : req.empresaID})).toString()
           // }
           };

        return res.send(result);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar Empresas'});
    }
});

module.exports = app  => app.use('/card', router);