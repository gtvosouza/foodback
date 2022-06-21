const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    documento: {
        type: String,
        required: true,
    },
    telefone: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true,
        select: false,
    },

    enderecos: [ 
        {
            logradouro: {
                type: String,
            },
            numero: {
                type: String,
            },
            cidade: {
                type: String,
            },
            bairro: {
                type: String,
            },
            cep: {
                type: String,
            },
            uf: {
                type: String,
            }
        }
    ],

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