const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const GraficoSchema = new mongoose.Schema({
    periodo: {
        type: String,
        require: true,
    },
    tipo: {
        type: String,
        require: true,
    },    
    quantidade: {
        type: Number,
        require: true,
    },
    ano: {
        type: Number,
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
    }
})

const Graficos = mongoose.model('Grafico', GraficoSchema);

module.exports = Graficos;