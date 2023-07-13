const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getByEmail } = require('../../models/user.model');



router.post('/registro', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8); //encriptamos password

    try {
        const ubicacion = await getCoordenadas(req.body.direccion, req.body.ciudad);//Obetener coordenadas según la dirección

        if (ubicacion) {//solo añadimos latitud y longitud si nos devuelve el dato, si no se rellena con valores por defecto
            req.body.latitud = ubicacion.latitude;
            req.body.longitud = ubicacion.longitude;
        }

        const [result] = await create(req.body);
        const [usuarioArr] = await getById(result.insertId);
        let usuario = usuarioArr[0];

        if (req.body.rol !== "profe") {
            return res.json(usuario);
        }

        //Si el rol es profe añadir registro a tabla profesor
        const [resultProfe] = await createProfe(usuario.id, req.body);
        const [profeArr] = await getProfeByUsuarioId(usuario.id, false);
        const profe = profeArr[0];
        delete profe.id;
        delete profe.usuario_id;
        usuario = { ...usuario, ...profe }; //Object.assign(usuario, profe);+/

        //comprobamos que nos llegan asignaturas
        const asignaturasArr = req.body.asignaturas;
        if (asignaturasArr === 0) {
            return res.json(usuario);
        }

        //Si la asignatura existe, creamos registro en tablas profesores_asignaturas
        const asignaturas = [];
        for (let asignatura of asignaturasArr) {
            const [result] = await getAsignaturaById(asignatura);
            if (result.length > 0) {
                await createProfeAsignatura(usuario.id, asignatura);
                asignaturas.push(result[0].nombre);
            }
        }
        usuario.asignaturas = asignaturas;

        res.json(usuario);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {

        const [result] = await getByEmail(req.body.email);
        if (result.length === 0) {
            return res.json('Error: email y/o contraseña no válidos')
        }

        const user = result[0];

        const iguales = bcrypt.compareSync(req.body.password, user.password);//comparamos las contraseñas
        if (!iguales) {
            return res.json('Error: email y/o contraseña no válidos');
        }

        res.json({ token: createToken(user) });

    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

module.exports = router;