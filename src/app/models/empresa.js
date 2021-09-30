const mongoose = require('../../database');

const EmpresaSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    cnpj: {
        type: String,
        require: true,
    },
    users: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',        
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Empresa = mongoose.model('Empresa', EmpresaSchema);

module.exports = Empresa;