const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const AgendaSchema = new mongoose.Schema({
    data: {
        type: Date,
        require: true,
    },
    hora: {
        type: String,
        require: true,
    },
    nomeFuncionario: {
        type: String,
        require: true,
    },
    nomeFuncao: {
        type: String,
        require: true,
    },
    sIdEmpresa: {
        type: Number,
        require: false,
    },
    sIdFuncionario: {
        type: Number,
        require: false,
    },
    tipoExame: {
        type: String,
        require: true,
    },
    divisao: [{
        controle: String,
        dados:[{descricao: String}],
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Agenda = mongoose.model('Agenda', AgendaSchema);

module.exports = Agenda;