const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const NodeGeocoder = require('node-geocoder');


const createToken = (usuario) => {
    const dataToken = {
        id_usuario: usuario.id,
        rol: usuario.rol,
        exp: dayjs().add(1, 'days').unix()
    }
    return jwt.sign(dataToken, 'Richar es gey');
};

module.exports = {
    createToken
}
