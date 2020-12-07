const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const FuncionarioSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },    
    idSistema: {
        type: Number,
        require: true,
        unique: true,
    },
    sIdEmpresa: {
        type: Number,
        require: true,
    },
    dtNasc: {
        type: Date,
        required: true,
    },
    dtAdmissao: {
        type: Date,
    },
    dtDemissao: {
        type: Date,
    },
    cpf: {
        type: String
    },
    funcao: {
        type: String
    },
    setor: {
        type: String
    },
    empresa: {
        type: mongoose.Types.ObjectId,
        ref: 'Empresa',
        require: false
    },
    ativo: {
        type: Boolean
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Funcionario = mongoose.model('Funcionario', FuncionarioSchema);

module.exports = Funcionario;