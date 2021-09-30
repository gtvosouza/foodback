const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const AgendaGeralSchema = new mongoose.Schema({
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
    tipoExame: {
        type: String,
        require: true,
    },
    empresa: {
        type: mongoose.Types.ObjectId,
        ref: 'Empresa',
        require: false
    },     
    reservada: {
        type: String,
        require: true,
    },
    processada: {
        type: String,
        require: true,
    },
    
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Agenda = mongoose.model('AgendaGeral', AgendaGeralSchema);

module.exports = Agenda;