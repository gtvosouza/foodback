const express = require('express');

const authMiddlware  = require('../middlewares/auth');
const Empresa = require('../models/empresa');
const User = require('../models/user');

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

        console.log(idSistema);

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