const { response, request } = require('express');
const bcrypt = require('bcryptjs')

const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req = request, res = response) => {

    const { email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese correo'
            })
        }

        usuario = new Usuario(req.body);


        //encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(password, salt)

        await usuario.save();
        //Generando token
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            })
        }

        //Confirmando password
        const validPassword = bcrypt.compareSync(password, usuario.password)

        if (!validPassword) {
            res.status(400).json({
                ok: false,
                msg: 'Password incorreto'
            })
        };

        const token = await generarJWT(usuario.id, usuario.name);


        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const revalidatToken = async (req, res = response) => {

    const { uid, name } = req;

    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidatToken
}