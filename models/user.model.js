


const getByEmail = (email) => {
    return db.query('SELECT * FROM usuarios WHERE email=? AND borrado=0', [email]);
}


module.exports = {
    getByEmail
}