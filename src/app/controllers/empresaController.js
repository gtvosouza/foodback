const express = require('express');

const authMiddlware  = require('../middlewares/auth');
const Empresa = require('../models/empresa');
const Funcao = require('../models/funcao');
const Funcionario = require('../models/funcionario');
const Agenda = require('../models/agenda');
const Exame = require('../models/exame');
const User = require('../models/user');
const Grafico = require('../models/grafico');

const router = express.Router();

router.use(authMiddlware);

router.get('/', async(req, res) => {
    try{
        const empresas = await Empresa.find().select('+idSistema');

        return res.send({empresas});

    }catch (error){
        return res.status(400).send({ error: 'Erro ao listar Empresas'});
    }
});

router.get('/:empresaId', async(req, res) => {
    try{
        const empresas = await Empresa.findById( req.params.empresaID );

        return res.send({empresas});

    }catch (error){
        return res.status(400).send({ error: 'Erro ao listar Empresas'});
    }
});

router.post('/', async(req, res) => {

    try{
        const { name, cnpj, users, idSistema } = req.body;
        
        await User.deleteMany({ sIdEmpresa: idSistema });
        await Funcao.deleteMany({ sIdEmpresa: idSistema });
        await Funcionario.deleteMany({ sIdEmpresa: idSistema });
        await Agenda.deleteMany({ sIdEmpresa: idSistema });
        await Exame.deleteMany({ sIdEmpresa: idSistema });
        await Grafico.deleteMany({ sIdEmpresa: idSistema });
        await Empresa.deleteMany({ idSistema: idSistema });

        const empresa = await Empresa.create({name, cnpj, idSistema});

        await Promise.all(users.map(async user => {
            const userEmpresa = new User({...user, empresa: empresa._id});

            await userEmpresa.save();
            empresa.users.push(userEmpresa);
        }));

        await empresa.save();

        return res.send({empresa});

    }catch (err){
        console.log(err);
        return res.status(400).send({ error: 'Erro ao criar Empresa'});
    }
});

router.put('/:empresaId', async(req, res) => {
    res.send({ok : true, user: req.userId });
});

module.exports = app  => app.use('/empresa', router);