/* 
    Rutas de usuario / Auth
    host + /api/events 
*/

const { Router } = require('express');
const { check } = require('express-validator')

const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

router.use(validarJWT);

router.get('/', getEventos);

router.post('/',
    [
        check('title', 'El titulo es Obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de final es obligatoria').custom(isDate),
        validarCampos
    ]
    , crearEvento)

router.put('/:id', actualizarEvento)

router.delete('/:id', eliminarEvento)

module.exports = router;