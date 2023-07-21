const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getByEmail, create } = require('../../models/user.model');
const { createToken } = require('../../utils/helpers');



router.post('/registro', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8); //encriptamos password

    try {

        const [result] = await create(req.body);

        res.json(result[0]);

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

router.post('/validate', async (req, res) => {
    try {

        if (req.body.token)
            res.json({ validacion: true });
        else
            res.json({ validacion: false });

    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

module.exports = router;