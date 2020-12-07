const mongoose = require('../../database');

const FuncaoSchema = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    setor: {
        type: String,
    },
    ambiente: {
        type: String,
    },
    cbo: {
        type: String,
    },
    qtdeFuncionarios: {
        type: Number,
    },
    percentFuncionarios: {
        type: Number,
    },
    sIdEmpresa: {
        type: Number,
        require: true,
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

const Funcao = mongoose.model('Funcao', FuncaoSchema);

module.exports = Funcao;