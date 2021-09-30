const express = require('express');
const router = express.Router();

const Funcionario = require('../models/funcionario');
const Empresa = require('../models/empresa');
const authMiddlware  = require('../middlewares/auth');

router.use(authMiddlware);

router.get('/', async(req, res) => {
    
    try{       
        
        const { page, funcao, nomeFuncionario } = req.query;
        const skip = (page - 1) * 10;
        
        const count = await  Funcionario.countDocuments({empresa : req.empresaID,  funcao :  !!funcao ? new RegExp(funcao, 'i') :new RegExp(' '),   name :  !!nomeFuncionario ? new RegExp(nomeFuncionario, 'i') :new RegExp(' ') });
        
        let result = {
            funcionarios:  await Funcionario.find({empresa : req.empresaID,  funcao :  !!funcao ? new RegExp(funcao, 'i') :new RegExp(' '), name :  !!nomeFuncionario ? new RegExp(nomeFuncionario, 'i') :new RegExp(' ')  }) 
                                            .limit(10)
                                            .skip(skip)
                                            .sort(
                                            { 
                                                dtDemissao : 1
                                            }),
            pages: Math.ceil(count / 10)
        };

        return res.send(result);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar Funcionários'});
    }
});


router.get('/ativos', async(req, res) => {
    
    try{       
        const funcionarios =  await Funcionario.find({empresa : req.empresaID, dtDemissao : null });
        
        return res.send(funcionarios);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar Funcionários Ativos'});
    }
});
router.post('/', async(req, res) => {
    try{
        const { funcionarios  } = req.body;
        
        await Funcionario.deleteMany({ idSistema: funcionarios[0].sIdEmpresa });

        for (let i = 0; i < funcionarios.length; i++) {
            const { sIdEmpresa } = funcionarios[i];

            const empresa = await Empresa.findOne({ idSistema: sIdEmpresa });
         
            if (!!empresa){
                const funcionario = await Funcionario.create({...funcionarios[i], empresa: empresa._id});

                await funcionario.save();                       
            }
        }

        return res.send({});

    }catch(err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed'});
    }    
});

module.exports = app  => app.use('/funcionario', router);