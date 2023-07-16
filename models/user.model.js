


const getByEmail = (email) => {
    return db.query('SELECT * FROM usuarios WHERE email=? AND borrado=0', [email]);
}

const create = ({ username, email, password, rol, id_datos}) => {
    return db.query(
        'INSERT INTO usuarios (username, email, password, rol, activo, borrado, id_datos) VALUES (?,?,?,?,?,?,?)',
        [username, email, password, rol, 0, 0, id_datos]);
}


module.exports = {
    getByEmail, create
}