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
        require: true,
    },
    tipoExame: {
        type: String,
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

const Agenda = mongoose.model('Agenda', AgendaSchema);

module.exports = Agenda;