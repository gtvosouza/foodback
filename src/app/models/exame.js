const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const ExameSchema = new mongoose.Schema({
    data: {
        type: Date,
        require: true,
    },
    proximoExame: {
        type: Date,
        require: true,
    },    
    idFuncionario: {
        type: Number,
        require: true,
    },
    tipoExame: {
        type: String,
        require: true,
    },
    nomeExame: {
        type: String,
        require: true,
    },
    status: {
        type: String
    },
    funcionario: {
        type: mongoose.Types.ObjectId,
        ref: 'Funcionario',
        require: false
    },
    empresa: {
        type: mongoose.Types.ObjectId,
        ref: 'Empresa',
        require: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Exames = mongoose.model('Exame', ExameSchema);

module.exports = Exames;