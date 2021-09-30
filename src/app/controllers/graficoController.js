const express = require('express');

const authMiddlware  = require('../middlewares/auth');

const router = express.Router();
const Grafico = require('../models/grafico');
const Empresa = require('../models/empresa');

router.use(authMiddlware);

router.get('/exames', async(req, res) => {
    
    try{
        const graficosExames = await Grafico.find({empresa : req.empresaID, tipo : 'E'})
        
        return res.send(graficosExames);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar dados de Exames'});
    }
});


router.get('/funcionarios', async(req, res) => {
    
    try{

        const graficosFuncionario = await Grafico.find({empresa : req.empresaID, tipo : 'F'})
        
        return res.send(graficosFuncionario);
       
    }catch (error){
        console.log(error)
        return res.status(400).send({ error: 'Erro ao listar dados de Funcionarios'});
    }
});

router.post('/', async(req, res) => {
    try{
        const { registros  } = req.body;
                
        await Grafico.deleteMany({ sIdEmpresa: registros[0].sIdEmpresa, tipo: registros[0].tipo});

        for (let i = 0; i < registros.length; i++) {
            const { sIdEmpresa } = registros[i];

            const empresa = await Empresa.findOne({ idSistema: sIdEmpresa });
         
            if (!!empresa){
                const registro = await Grafico.create({...registros[i], empresa: empresa._id});

                await registro.save();                       
            }
        }

        return res.send({});

    }catch(err) {
        console.log(error)
        return res.status(400).send({ error: 'Registration failed'});
    }
});

module.exports = app => app.use('/graficos', router);