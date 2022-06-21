const express = require('express');
const User = require('../models/usuario');
const authMiddlware  = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddlware);

router.post('/endereco', async(req, res) => {
    try{
        const { logradouro, numero, cidade, bairro, cep, uf } = req.body;
  
        const endereco = {logradouro, numero, cidade, bairro, cep, uf};

        const user = await User.updateOne(
                                { _id: req.userId }, 
                                { $push: { enderecos: endereco } }
                        );
        
        return res.send(user);

    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

router.put('/endereco/:idendereco', async(req, res) => {
    try{        
        const { idendereco } = req.params;
        
        const { logradouro, numero, cidade, bairro, cep, uf } = req.body;
        const endereco = {_id: idendereco, logradouro, numero, cidade, bairro, cep, uf};

        const user = await User.updateOne(
                                    { _id: req.userId, "enderecos._id": idendereco }, 
                                    { $set: { enderecos: endereco } });
                             
        if(user == undefined)
            return res.status(400).send({ error: 'Falha ao alterar Registro'});
        else
            return res.send({status: "OK", message: "Registro Alterado com sucesso"});

    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

router.get('/enderecos', async(req, res) => {
    try{        
        const projection = {_id: 0, enderecos : 1};
        const user = await User.findById({_id: req.userId}, projection);
        
        return res.send(user.enderecos);

    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

router.delete('/endereco/:idendereco', async(req, res) => {
    try{        
        const { idendereco } = req.params;

        const user = await User.updateOne(
                                    { _id: req.userId }, 
                                    { $pull: { enderecos: {_id: idendereco} } });
                             
        if(user == undefined)
            return res.status(400).send({ error: 'Falha ao alterar Registro'});
        else
            return res.send({status: "OK", message: "Registro Excluído com sucesso"});

    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

router.put('/', async(req, res) => {
    try{
        const filter = { _id: req.userId };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                _id: req.userId, 
                email: req.body.email,
                nome: req.body.nome,
                documento: req.body.documento,
                telefone: req.body.telefone,
            },
          };

        const user = await User.updateOne(filter, 
                                     updateDoc,
                                     options);
        
        if(user == undefined)
            return res.status(400).send({ error: 'Falha ao alterar Registro'});
        else
            return res.send({status: "OK", message: "Registro Alterado com sucesso"});
    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

router.get('/', async(req, res) => {
    try{        
        const projection = {email : 1, nome: 1, documento: 1, telefone: 1};
        const user = await User.findById({_id: req.userId}, projection);
        
        return res.send(user);

    }catch(err) {
        return res.status(400).send({ error: 'Registration failed ' + err});
    }
});

module.exports = app => app.use('/usuario', router);