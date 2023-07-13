const jwt = require('jsonwebtoken');
const { getById } = require('../models/usuario.model');

const checkToken = async (req, res, next) => {
    //comprobamos si esta la cabecera authorization
    if (!req.headers.authorization) {
        return res.json('Error: no has enviado la cabecera de autorización')
    }
    const token = req.headers.authorization;

    //comprobamos si el token es válido
    try {
        const dataToken = jwt.verify(token, 'TFM Grupo D');
        const [usuario] = await getById(dataToken.usuario_id);
        req.usuario = usuario[0];
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }

    next();
}

const checkAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        return res.json('Tienes que ser administrador para acceder');
    }

    next();
}

const checkCliente = (req, res, next) => {
    if (req.usuario.rol !== 'profe') {
        return res.json('Tienes que ser profesor para acceder');
    }

    next();
}

const checkVendedor = (req, res, next) => {
    if (req.usuario.rol !== 'alum') {
        return res.json('Tienes que ser alumno para acceder');
    }

    next();
}

module.exports = {
    checkToken, checkAdmin, checkVendedor, checkCliente
}