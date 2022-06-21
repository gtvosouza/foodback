const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    cnpj: {
        type: String,
        required: true,
    },
    nome_fantasia: {
        type: String,
        required: true,
    },
    razao_social: {
        type: String,
        required: true,
    },
    endereco: {
        type: String,
        required: true,
    },

    createdAt:{
        type: Date,
        default: Date.now,
        select: false,
    }
})

UsuarioSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.senha, 10);

    this.senha = hash;

    next();
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;