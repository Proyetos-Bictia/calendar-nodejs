const { response, request } = require('express');
const Evento = require('../models/Evento')

const getEventos = async (req = request, res = response) => {
    const eventos = await Evento.find().populate('user', 'name');
    res.status(200).json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req = request, res = response) => {
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        res.status(200).json({
            ok: false,
            evento: eventoGuardado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador...'
        })
    }
}

const actualizarEvento = async (req = request, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid
    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe por el id'
            })
        }
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar esta vaina'
            });
        }
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });

        res.status(201).json({
            ok: true,
            evento: eventoActualizado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador...'
        })
    }
}

const eliminarEvento = async (req = request, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid

    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            res.status(404).json({
                ok: false,
                msg: 'Evento no existe por el id'
            })
        }
        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar esta vaina'
            });
        }

        const eventoActualizado = await Evento.findByIdAndDelete(eventoId);

        res.status(201).json({
            ok: true,
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador...'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}