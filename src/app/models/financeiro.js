const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const FinanceiroSchema = new mongoose.Schema({
    data: {
        type: Date,
        require: true,
    },
    vencimento: {
        type: Date,
        require: true,
    },    
    descricao: {
        type: String
    },
    linhaDigitavel: {
        type: String
    },
    codigoBarras: {
        type: String
    },
    competencia: {    
        type: String
    },
    valor: {
        type: Number,
        require: true,
    },
    situacao: {
        type: String,
        require: true,
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

const Financeiro = mongoose.model('Financeiro', FinanceiroSchema);

module.exports = Financeiro;