const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const AuxiliarSchema = new mongoose.Schema({
    flag: {
        type: Number,
        require: true,
    },
    idSistema: {
        type: String,
        require: true,
    },
    descricao: {
        type: String,
        require: true,
    },
    ativo: {
        type: Boolean
    }
})

const Auxiliar = mongoose.model('Auxiliar', AuxiliarSchema);

module.exports = Auxiliar;